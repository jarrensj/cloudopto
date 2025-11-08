import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Network } from 'x402-next';

export async function GET() {
  try {
    const network = process.env.NEXT_PUBLIC_NETWORK as Network;
    
    // Fetch all folders to build payment config
    const { data: folders, error } = await supabase
      .from('folders')
      .select('slug, name, usdc_amount, wallet_address')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching folders for payment config:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment configuration' },
        { status: 500 }
      );
    }

    // Build payment config object for x402-next
    const paymentConfig: Record<string, any> = {};
    
    folders.forEach((folder) => {
      paymentConfig[`/content/${folder.slug}`] = {
        price: `$${folder.usdc_amount.toFixed(2)}`,
        config: {
          description: `Access to ${folder.name}`,
        },
        network: network,
      };
    });

    return NextResponse.json(paymentConfig);
  } catch (error) {
    console.error('Error building payment config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

