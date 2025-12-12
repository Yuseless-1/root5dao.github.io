const PRINTIFY_API_BASE = 'https://api.printify.com/v1';
const PRINTIFY_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6Ijk2YmQzZTRkZDk5OWRjNDkyYmI0MWZkZWI3YWU3M2IyYmQ5NmI4N2NlOGQ1MDQ2ZDg1NmZhZDBiMjg3YmExNGUxMzQyZjVkZGY5NjQ0NzU5IiwiaWF0IjoxNzY0NzE1MTgyLjUxODA3MywibmJmIjoxNzY0NzE1MTgyLjUxODA3NSwiZXhwIjoxNzk2MjUxMTgyLjUxMzcyNCwic3ViIjoiMjUyODMxMzUiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.uoW1RzQOOkT5Ugm0gEha-7B3BUnLpOy021ZCggE6xTAdsxLwfSFfLHCmYeNRQl5v50E35WJ849Znt3mjoDJ9XRGOWrLRGjUuP3Hb1B2qmeovQP9yD4NRVMf6rezuVUNdMgVnKHLE-6snCmapyZNOKLJM5s3KlDLTWfwK2sqiYY4D_JeZDMkxBMaEONG4xM7mrAy7j3lJwjdVTQuI1tWVGkhSuCwvjrorCDe2mMJQpnaxyWvf_0JCnQgbHffcxcRmN04TM9uEkwjxmzvo2TbbSKy78l4VecGjRs2QRQs7iWMFHQtk5M64cYh2Pm5swhjr6hWxWGg-dxtsEHr35lz31r4NgeHBSdtuHu31k1NQaJ7YEGdaiUFTvYrlha9Iz5QKS8FgqJt27UwzT_StLbS_kzFlulkPykfY6WpmZOfnIyv6EpviAVY4mvEzQ4iHZ1jIE2UccJERr5WTIC4AKOrJbXbTK3hKeEvcMz3QeqmXyiJ5BsDNjk34erqY6uSvllpQsxH55SMBOcWAz1-5Spk11mHqauqU7niS7GHnW-DAcG_kynx0ixFXEbzeg8bzgFkjCCpJG54CJFdweW5-CF9mOmVaNRFLYlFob9BeC58YUcr0hO2YdV_XrItWzednuIOrpS5PO_KwkSY8OKgUbt1KrZ37fn9-bMpvjJHOrRGtfW4';
const PRINTIFY_SHOP_ID = '1';

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
    // API token is hardcoded, so this check is just for safety
    if (!PRINTIFY_API_TOKEN) {
      return { success: false, error: 'Printify API token not configured' };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    let response;
    try {
      response = await fetch(
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
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);
    } catch (fetchError: any) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        return {
          success: false,
          error: 'Connection timeout - Printify API took too long to respond',
        };
      }
      throw fetchError;
    }

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

