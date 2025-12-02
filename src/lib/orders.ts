import { getSupabaseServer } from './supabase-server';

export interface Order {
  id: string;
  wallet: string;
  total_usd: number;
  total_sol: number;
  root5_amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'processing';
  shipping: any;
  cart: any;
  items: any[];
  swap_transaction?: string;
  transfer_transaction?: string;
  swap_signature?: string;
  transfer_signature?: string;
  printify_order_id?: string;
  created_at: string;
  updated_at: string;
}

export async function createOrder(orderData: {
  id: string;
  wallet: string;
  totalUSD: number;
  totalSOL: number;
  root5Amount: number;
  shipping: any;
  cart: any;
  items: any[];
  swapTransaction?: string;
  transferTransaction?: string;
}): Promise<Order | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        id: orderData.id,
        wallet: orderData.wallet,
        total_usd: orderData.totalUSD,
        total_sol: orderData.totalSOL,
        root5_amount: orderData.root5Amount,
        status: 'pending',
        shipping: orderData.shipping,
        cart: orderData.cart,
        items: orderData.items,
        swap_transaction: orderData.swapTransaction,
        transfer_transaction: orderData.transferTransaction,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error; // Re-throw to be caught by caller
    }

    // Create order event
    try {
      await createOrderEvent(orderData.id, 'created', null, null, {
        wallet: orderData.wallet,
        totalUSD: orderData.totalUSD,
        totalSOL: orderData.totalSOL,
      });
    } catch (eventError) {
      console.error('Error creating order event (non-fatal):', eventError);
    }

    return data as Order;
  } catch (error: any) {
    console.error('Error creating order:', error);
    // Re-throw to let caller handle
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'completed' | 'cancelled' | 'processing',
  signatures?: { swap?: string; transfer?: string },
  printifyOrderId?: string
): Promise<Order | null> {
  try {
    const supabase = getSupabaseServer();
    // Get current order to track status change
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    const updateData: any = { status };
    if (signatures?.swap) updateData.swap_signature = signatures.swap;
    if (signatures?.transfer) updateData.transfer_signature = signatures.transfer;
    if (printifyOrderId) updateData.printify_order_id = printifyOrderId;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }

    // Create order event for status change
    try {
      await createOrderEvent(orderId, 'status_changed', currentOrder?.status, status);
    } catch (eventError) {
      console.error('Error creating order event (non-fatal):', eventError);
    }

    return data as Order;
  } catch (error: any) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createOrderEvent(
  orderId: string,
  eventType: 'created' | 'status_changed' | 'payment_received' | 'printify_created' | 'email_sent',
  oldStatus?: string | null,
  newStatus?: string | null,
  metadata?: any
): Promise<void> {
  try {
    const supabase = getSupabaseServer();
    await supabase.from('order_events').insert({
      order_id: orderId,
      event_type: eventType,
      old_status: oldStatus,
      new_status: newStatus,
      metadata: metadata || {},
    });
  } catch (error) {
    console.error('Error creating order event:', error);
    throw error;
  }
}

