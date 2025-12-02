const PRINTIFY_API_BASE = 'https://api.printify.com/v1';
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '1';

export interface PrintifyOrderLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

export interface PrintifyOrderAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface CreatePrintifyOrderParams {
  externalId: string;
  lineItems: PrintifyOrderLineItem[];
  shippingMethod: number; // 1 = standard, 2 = express, 3 = printify_express, 4 = economy
  addressTo: PrintifyOrderAddress;
  sendShippingNotification?: boolean;
}

export async function createPrintifyOrder(
  params: CreatePrintifyOrderParams
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    if (!PRINTIFY_API_TOKEN) {
      return { success: false, error: 'Printify API token not configured' };
    }

    const response = await fetch(
      `${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Root5DAO-Merch-Store/1.0',
        },
        body: JSON.stringify({
          external_id: params.externalId,
          line_items: params.lineItems,
          shipping_method: params.shippingMethod,
          address_to: params.addressTo,
          send_shipping_notification: params.sendShippingNotification || false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printify order creation error:', errorText);
      return {
        success: false,
        error: `Printify API error: ${response.status} - ${errorText.substring(0, 200)}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      orderId: data.id,
    };
  } catch (error) {
    console.error('Error creating Printify order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper to map our cart items to Printify line items
export function mapCartToPrintifyLineItems(
  cart: Array<{ productId: string; quantity: number }>,
  products: Array<{ 
    id: string; 
    printify_id?: string; 
    variants?: Array<{ id: number; price: number }> 
  }>
): PrintifyOrderLineItem[] {
  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        console.warn(`Product ${item.productId} not found in products list`);
        return null;
      }

      // Use printify_id if available, otherwise try to use the product id directly
      const printifyProductId = product.printify_id || product.id;

      // Get the first/default variant
      // If no variants in our data, we'll need to fetch from Printify API
      // For now, we'll require variants to be present
      const variant = product.variants?.[0];
      if (!variant) {
        console.warn(`No variant found for product ${item.productId}`);
        return null;
      }

      return {
        product_id: printifyProductId,
        variant_id: variant.id,
        quantity: item.quantity,
      };
    })
    .filter((item): item is PrintifyOrderLineItem => item !== null);
}

