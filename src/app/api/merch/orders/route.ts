import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrder, updateOrderStatus } from '@/lib/orders';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // In production, add admin authentication
    // const session = await getServerSession(request);
    // if (!session || !session.user) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    const orders = await getAllOrders();

    // Map to frontend format
    const formattedOrders = orders.map(order => ({
      id: order.id,
      wallet: order.wallet,
      totalUSD: order.total_usd,
      totalSOL: order.total_sol,
      root5Amount: order.root5_amount,
      status: order.status,
      shipping: order.shipping,
      items: order.items,
      createdAt: order.created_at,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'completed', 'cancelled', 'processing'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(orderId, status as any);

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        wallet: updatedOrder.wallet,
        totalUSD: updatedOrder.total_usd,
        totalSOL: updatedOrder.total_sol,
        root5Amount: updatedOrder.root5_amount,
        status: updatedOrder.status,
        shipping: updatedOrder.shipping,
        items: updatedOrder.items,
        createdAt: updatedOrder.created_at,
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

