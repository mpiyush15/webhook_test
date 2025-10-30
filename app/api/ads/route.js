// app/api/ads/route.js (App Router)
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const adAccountId = searchParams.get('adAccountId');
  const accessToken = searchParams.get('accessToken');

  if (!adAccountId || !accessToken) {
    return NextResponse.json(
      { error: 'Missing adAccountId or accessToken' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns?fields=id,name,status,objective&access_token=${accessToken}`
    );
    
    const data = await response.json();
    console.log('Fetched data is:', data);
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads data' },
      { status: 500 }
    );
  }

}
