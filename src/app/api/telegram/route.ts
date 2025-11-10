import { NextResponse } from 'next/server';

// Telegram group invite link: https://t.me/+Thjq7FzYysczYWI5
// To get member count, we need either:
// 1. Telegram Bot API (requires bot token and bot must be in group)
// 2. A third-party service
// 3. Manual update via environment variable

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '-1001234567890'; // Default fallback
    
    // If bot token is provided, fetch from Telegram API
    if (botToken) {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/getChatMemberCount?chat_id=${chatId}`,
          {
            next: { revalidate: 300 } // Cache for 5 minutes
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.result) {
            return NextResponse.json({ 
              count: data.result,
              source: 'telegram_api'
            });
          }
        }
      } catch (error) {
        console.error('Telegram API error:', error);
      }
    }
    
    // Fallback: Use environment variable or default
    const fallbackCount = process.env.TELEGRAM_MEMBER_COUNT || '420';
    
    return NextResponse.json({ 
      count: parseInt(fallbackCount, 10),
      source: 'fallback'
    });
  } catch (error) {
    console.error('Error fetching Telegram members:', error);
    return NextResponse.json({ 
      count: 420,
      source: 'error_fallback'
    }, { status: 200 });
  }
}

