import { getSupabaseServer } from './supabase-server';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendOrderConfirmationEmail(
  orderId: string,
  email: string,
  orderData: {
    totalUSD: number;
    totalSOL: number;
    root5Amount: number;
    items: Array<{ productId: string; quantity: number; price: number }>;
    shipping: {
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      region: string;
      zip: string;
      country: string;
    };
  }
): Promise<boolean> {
  try {
    // Use Supabase Edge Function for email (or integrate with Resend/SendGrid)
    // For now, we'll use Supabase's built-in email if configured
    // Otherwise, you can use a service like Resend

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 24px; font-weight: bold; color: #667eea; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
              <p>Thank you for your purchase!</p>
            </div>
            <div class="content">
              <p>Hi ${orderData.shipping.firstName},</p>
              <p>Your order <strong>${orderId}</strong> has been confirmed and is being processed.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total:</strong> $${orderData.totalUSD.toFixed(2)} (${orderData.totalSOL.toFixed(4)} SOL)</p>
                <p><strong>ROOT5 Tokens:</strong> ${orderData.root5Amount.toFixed(2)}</p>
                
                <h3>Items:</h3>
                ${orderData.items.map(item => `
                  <div class="item">
                    <p><strong>Product:</strong> ${item.productId}</p>
                    <p><strong>Quantity:</strong> ${item.quantity} × $${item.price.toFixed(2)}</p>
                  </div>
                `).join('')}
                
                <div class="total">Total: $${orderData.totalUSD.toFixed(2)}</div>
              </div>
              
              <div class="order-details">
                <h2>Shipping Address</h2>
                <p>${orderData.shipping.firstName} ${orderData.shipping.lastName}</p>
                <p>${orderData.shipping.address1}</p>
                <p>${orderData.shipping.city}, ${orderData.shipping.region} ${orderData.shipping.zip}</p>
                <p>${orderData.shipping.country}</p>
              </div>
              
              <p>We'll send you a tracking number once your order ships.</p>
              
              <div class="footer">
                <p>Thank you for shopping with Root5DAO!</p>
                <p>If you have any questions, please contact us at <a href="mailto:contact@root5dao.com" style="color: #667eea;">contact@root5dao.com</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Option 1: Use Supabase Edge Function (recommended)
    // You'll need to create a Supabase Edge Function for sending emails
    // For now, we'll use a simple fetch to a webhook/API endpoint
    
    // Option 2: Use Resend API (if configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'contact@root5dao.com',
          to: email,
          subject: `Order Confirmation - ${orderId}`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        // Record email event
        try {
          const supabase = getSupabaseServer();
          await supabase.from('order_events').insert({
            order_id: orderId,
            event_type: 'email_sent',
            metadata: { email, type: 'confirmation' },
          });
        } catch (eventError) {
          console.error('Error recording email event (non-fatal):', eventError);
        }
        return true;
      }
    }

    // Option 3: Use Supabase Edge Function
    const supabaseFunctionUrl = process.env.SUPABASE_FUNCTION_URL;
    if (supabaseFunctionUrl) {
      const response = await fetch(`${supabaseFunctionUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: email,
          subject: `Order Confirmation - ${orderId}`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        try {
          const supabase = getSupabaseServer();
          await supabase.from('order_events').insert({
            order_id: orderId,
            event_type: 'email_sent',
            metadata: { email, type: 'confirmation' },
          });
        } catch (eventError) {
          console.error('Error recording email event (non-fatal):', eventError);
        }
        return true;
      }
    }

    console.warn('No email service configured. Email not sent.');
    return false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

