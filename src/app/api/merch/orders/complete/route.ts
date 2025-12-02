import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getOrder } from '@/lib/orders';
import { triggerWebhooks } from '@/lib/webhooks';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { createPrintifyOrder, mapCartToPrintifyLineItems } from '@/lib/printify-orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, swapSignature, transferSignature } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status to processing
    try {
      await updateOrderStatus(orderId, 'processing', {
        swap: swapSignature,
        transfer: transferSignature,
      });
    } catch (updateError: any) {
      console.error('Error updating order status (non-fatal):', updateError);
      // Continue even if update fails
    }

    // Trigger webhook for payment received
    try {
      await triggerWebhooks(orderId, 'order.payment_received', {
        orderId,
        swapSignature,
        transferSignature,
      });
    } catch (webhookError) {
      console.error('Webhook error (non-fatal):', webhookError);
    }

    // Create Printify order
    let printifyOrderId: string | undefined;
    try {
      // Fetch products from the API to get Printify mappings
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     (request.headers.get('origin') || 'http://localhost:3000');
      const productsResponse = await fetch(`${baseUrl}/api/merch/products`);
      const productsData = await productsResponse.json();
      const allProducts = productsData.products || [];

      const printifyLineItems = mapCartToPrintifyLineItems(order.cart, allProducts);

      if (printifyLineItems.length > 0) {
        const printifyResult = await createPrintifyOrder({
          externalId: orderId,
          lineItems: printifyLineItems,
          shippingMethod: 1, // Standard shipping
          addressTo: {
            first_name: order.shipping.firstName,
            last_name: order.shipping.lastName,
            email: order.shipping.email,
            phone: order.shipping.phone || '',
            country: order.shipping.country || 'US',
            region: order.shipping.region,
            address1: order.shipping.address1,
            address2: order.shipping.address2,
            city: order.shipping.city,
            zip: order.shipping.zip,
          },
          sendShippingNotification: true,
        });

        if (printifyResult.success && printifyResult.orderId) {
          printifyOrderId = printifyResult.orderId;
          try {
            await updateOrderStatus(orderId, 'processing', undefined, printifyOrderId);
          } catch (updateError) {
            console.error('Error updating order with Printify ID (non-fatal):', updateError);
          }
          
          // Trigger webhook for Printify order created
          try {
            await triggerWebhooks(orderId, 'order.printify_created', {
              orderId,
              printifyOrderId,
            });
          } catch (webhookError) {
            console.error('Webhook error (non-fatal):', webhookError);
          }
        }
      }
    } catch (printifyError) {
      console.error('Error creating Printify order:', printifyError);
      // Don't fail the whole process if Printify fails
    }

    // Update order status to completed
    let updatedOrder;
    try {
      updatedOrder = await updateOrderStatus(orderId, 'completed', {
        swap: swapSignature,
        transfer: transferSignature,
      }, printifyOrderId);
    } catch (updateError: any) {
      console.error('Error updating order to completed (non-fatal):', updateError);
      updatedOrder = order; // Use original order if update fails
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(orderId, order.shipping.email, {
        totalUSD: order.total_usd,
        totalSOL: order.total_sol,
        root5Amount: order.root5_amount,
        items: order.items,
        shipping: order.shipping,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail if email fails
    }

    // Trigger webhook for order completed
    try {
      await triggerWebhooks(orderId, 'order.completed', {
        orderId,
        status: 'completed',
        printifyOrderId,
      });
    } catch (webhookError) {
      console.error('Webhook error (non-fatal):', webhookError);
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      printifyOrderId,
    });
  } catch (error) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to complete order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

