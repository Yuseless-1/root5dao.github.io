import { NextResponse } from 'next/server';

// Printify API configuration
const PRINTIFY_API_BASE = 'https://api.printify.com/v1';
const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '1';

interface PrintifyProduct {
  id: string | number;
  title: string;
  description?: string;
  tags?: string[];
  variants?: Array<{
    id: number;
    price: number;
    is_enabled: boolean;
    is_default: boolean;
    options: Record<string, any>;
  }>;
  images?: Array<{
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
  }>;
  is_locked?: boolean;
  blueprint_id?: number;
  print_provider_id?: number;
  user_id?: number;
  shop_id?: number;
  print_areas?: Array<{
    variant_ids: number[];
    placeholders: Array<{
      position: string;
      images: Array<{
        id: string;
        name: string;
        type: string;
        x: number;
        y: number;
        scale: number;
        angle: number;
      }>;
    }>;
  }>;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

interface MappedProduct {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  image_url: string;
  stock: number;
  printify_id?: string;
  variants?: Array<{
    id: number;
    price: number;
    options: Record<string, any>;
  }>;
}

// Fallback products if Printify API fails
const FALLBACK_PRODUCTS: MappedProduct[] = [
  {
    id: '1',
    name: 'Root5DAO T-Shirt',
    description: 'Premium cotton t-shirt with Root5DAO logo',
    price_usd: 29.99,
    image_url: '/images.jpeg',
    stock: 100,
  },
  {
    id: '2',
    name: 'Root5DAO Hoodie',
    description: 'Comfortable hoodie featuring Root5DAO branding',
    price_usd: 59.99,
    image_url: '/images.jpeg',
    stock: 50,
  },
  {
    id: '3',
    name: 'Root5DAO Cap',
    description: 'Stylish cap with embroidered Root5DAO logo',
    price_usd: 24.99,
    image_url: '/images.jpeg',
    stock: 75,
  },
];

// Helper function to strip HTML and clean description
function cleanDescription(html: string | undefined): string {
  if (!html) return 'Premium quality product from Root5DAO';
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Extract a clean summary (first 200 characters)
  // Remove size guide tables and other verbose content
  const lines = text.split(/\n|\./).filter(line => {
    const lower = line.toLowerCase().trim();
    // Skip size guide content, care instructions headers, etc.
    return !lower.includes('size guide') && 
           !lower.includes('width, in') &&
           !lower.includes('length, in') &&
           !lower.includes('sleeve length') &&
           !lower.includes('size tolerance') &&
           !lower.startsWith('product features') &&
           !lower.startsWith('care instructions') &&
           line.trim().length > 10; // Only keep substantial lines
  });
  
  // Get the first meaningful paragraph
  const cleanText = lines.slice(0, 3).join('. ').trim();
  
  // Limit to 200 characters for display
  if (cleanText.length > 200) {
    return cleanText.substring(0, 197) + '...';
  }
  
  return cleanText || 'Premium quality product from Root5DAO';
}

function mapPrintifyProduct(printifyProduct: PrintifyProduct): MappedProduct {
  // Get the default or first enabled variant for pricing
  const variants = printifyProduct.variants || [];
  const defaultVariant = variants.find(v => v.is_default && v.is_enabled) ||
                         variants.find(v => v.is_enabled) ||
                         variants[0];

  // Get the default or first image
  const images = printifyProduct.images || [];
  const defaultImage = images.find(img => img.is_default) ||
                       images[0];

  // Calculate price in USD (Printify prices are typically in cents)
  // If price is already in dollars, don't divide
  const rawPrice = defaultVariant ? defaultVariant.price : 0;
  const priceUsd = rawPrice > 1000 ? rawPrice / 100 : rawPrice; // Heuristic: if > 1000, assume cents

  // Get image URL
  const imageUrl = defaultImage?.src || '/images.jpeg';

  // Estimate stock (Printify doesn't always provide stock, so we'll use a default)
  // In production, you might want to check availability via Printify API
  const stock = printifyProduct.is_locked ? 0 : 100;

  // Convert ID to string
  const productId = String(printifyProduct.id);

  // Clean the description
  const cleanDesc = cleanDescription(printifyProduct.description);

  return {
    id: productId,
    name: printifyProduct.title || 'Untitled Product',
    description: cleanDesc,
    price_usd: priceUsd,
    image_url: imageUrl,
    stock: stock,
    printify_id: productId,
    variants: variants
      .filter(v => v.is_enabled)
      .map(v => ({
        id: v.id,
        price: v.price > 1000 ? v.price / 100 : v.price,
        options: v.options,
      })),
  };
}

export async function GET() {
  try {
    // If no API token is configured, return fallback products
    if (!PRINTIFY_API_TOKEN) {
      console.warn('PRINTIFY_API_TOKEN not configured, using fallback products');
      console.warn('Environment check - PRINTIFY_API_TOKEN exists:', !!process.env.PRINTIFY_API_TOKEN);
      return NextResponse.json({
        success: true,
        products: FALLBACK_PRODUCTS,
        source: 'fallback',
        debug: 'PRINTIFY_API_TOKEN not found in environment',
      });
    }

    console.log('Fetching products from Printify API...');
    console.log(`Shop ID: ${PRINTIFY_SHOP_ID}`);
    console.log(`API Base: ${PRINTIFY_API_BASE}`);
    console.log(`API Token exists: ${!!PRINTIFY_API_TOKEN} (length: ${PRINTIFY_API_TOKEN.length})`);

    // First, try to get shops to verify the shop ID
    let shopId = PRINTIFY_SHOP_ID;
    
    // Try to get shops list to find the correct shop ID
    try {
      const shopsResponse = await fetch(
        `${PRINTIFY_API_BASE}/shops.json`,
        {
          headers: {
            'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Root5DAO-Merch-Store/1.0',
          },
        }
      );

      if (shopsResponse.ok) {
        const shopsData = await shopsResponse.json();
        if (shopsData && Array.isArray(shopsData) && shopsData.length > 0) {
          // Use the first shop if shop ID is not found
          const foundShop = shopsData.find((s: any) => String(s.id) === String(shopId)) || shopsData[0];
          shopId = String(foundShop.id);
          console.log(`Using shop ID: ${shopId}`);
        }
      }
    } catch (shopError) {
      console.warn('Could not fetch shops list, using provided shop ID:', shopError);
    }

    // Fetch products from Printify API
    // According to Printify API docs, we need to include User-Agent header
    const response = await fetch(
      `${PRINTIFY_API_BASE}/shops/${shopId}/products.json?limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Root5DAO-Merch-Store/1.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Printify API error: ${response.status} ${response.statusText}`);
      console.error('Error response:', errorText);
      
      // Return fallback products if API fails
      return NextResponse.json({
        success: true,
        products: FALLBACK_PRODUCTS,
        source: 'fallback_api_error',
        error: `API Error: ${response.status} - ${errorText.substring(0, 200)}`,
      });
    }

    const data = await response.json();
    console.log('Printify API response structure:', Object.keys(data));
    console.log('Printify API response type:', Array.isArray(data) ? 'array' : typeof data);
    console.log('Printify API response sample:', JSON.stringify(data).substring(0, 1000));
    
    // According to Printify API documentation, the response is paginated with this structure:
    // {
    //   "data": [...],
    //   "current_page": 1,
    //   "last_page": 5,
    //   "total": 49,
    //   "per_page": 10,
    //   "from": 1,
    //   "to": 10,
    //   ...
    // }
    let printifyProducts: PrintifyProduct[] = [];
    
    if (data.data && Array.isArray(data.data)) {
      // Paginated response with data array (standard Printify format)
      printifyProducts = data.data;
      console.log(`Products found in paginated format: ${printifyProducts.length} products (page ${data.current_page || 1} of ${data.last_page || 1}, total: ${data.total || printifyProducts.length})`);
      
      // If there are more pages, we could fetch them, but for now we'll just use the first page
      // In production, you might want to implement pagination or fetch all pages
      if (data.last_page && data.last_page > 1) {
        console.log(`Note: There are ${data.last_page} pages of products. Currently showing page ${data.current_page || 1}.`);
      }
    } else if (Array.isArray(data)) {
      // Direct array response (fallback)
      printifyProducts = data;
      console.log('Products found in direct array format');
    } else if (data.products && Array.isArray(data.products)) {
      // Nested products array (fallback)
      printifyProducts = data.products;
      console.log('Products found in nested products format');
    } else {
      console.warn('Unknown response format:', Object.keys(data));
      // Try to find any array in the response
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          const firstItem = data[key][0];
          if (firstItem && (firstItem.id || firstItem.title)) {
            printifyProducts = data[key];
            console.log(`Products found in '${key}' array`);
            break;
          }
        }
      }
    }

    console.log(`Found ${printifyProducts.length} products from Printify`);

    // Map Printify products to our format
    const mappedProducts: MappedProduct[] = printifyProducts
      .filter(product => product && product.title && !product.is_locked) // Only include valid, published/unlocked products
      .map(mapPrintifyProduct);

    console.log(`Mapped ${mappedProducts.length} products`);

    // If no products found, return fallback
    if (mappedProducts.length === 0) {
      console.warn('No products found after mapping, using fallback');
      return NextResponse.json({
        success: true,
        products: FALLBACK_PRODUCTS,
        source: 'fallback_no_products',
        debug: {
          rawProductsCount: printifyProducts.length,
          mappedProductsCount: mappedProducts.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      products: mappedProducts,
      source: 'printify',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching products from Printify:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    
    // Return fallback products on error
    return NextResponse.json({
      success: true,
      products: FALLBACK_PRODUCTS,
      source: 'fallback_error',
      error: errorMessage,
    });
  }
}

