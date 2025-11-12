import { Address } from 'viem'
import { paymentMiddleware, Resource, Network } from 'x402-next'
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const address = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as Address
const network = process.env.NEXT_PUBLIC_NETWORK as Network
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource
const cdpClientKey = process.env.NEXT_PUBLIC_CDP_CLIENT_KEY as string

// Fetch dynamic payment config from database
async function getPaymentConfig() {
  const { data: folders } = await supabaseAdmin
    .from('folders')
    .select('slug, name, usdc_amount, wallet_address')
    .order('created_at', { ascending: false })

  const paymentConfig: Record<string, any> = {}
  
  folders?.forEach((folder) => {
    paymentConfig[`/content/${folder.slug}`] = {
      price: `$${folder.usdc_amount.toFixed(2)}`,
      config: {
        description: `Access to ${folder.name}`,
      },
      network,
    }
  })

  // Add fallback for unknown routes
  paymentConfig['/content/*'] = {
    price: '$0.10',
    config: {
      description: 'Access to premium content',
    },
    network,
  }

  return paymentConfig
}

export async function middleware(req: NextRequest) {
  // Fetch dynamic pricing config
  const paymentConfig = await getPaymentConfig()
  
  const x402PaymentMiddleware = paymentMiddleware(
    address,
    paymentConfig,
    {
      url: facilitatorUrl,
    },
    {
      cdpClientKey,
      appLogo: '',
      appName: '',
      sessionTokenEndpoint: '/api/x402/session-token',
    },
  )

  const delegate = x402PaymentMiddleware as unknown as (
    request: NextRequest,
  ) => ReturnType<typeof x402PaymentMiddleware>
  return delegate(req)
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Only match content routes, not API routes or static files
    '/content/:path*',
  ],
}
