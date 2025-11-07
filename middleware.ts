import { Address } from 'viem'
import { paymentMiddleware, Resource, Network } from 'x402-next'
import { NextRequest } from 'next/server'

const address = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as Address
const network = process.env.NEXT_PUBLIC_NETWORK as Network
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource
const cdpClientKey = process.env.NEXT_PUBLIC_CDP_CLIENT_KEY as string

const x402PaymentMiddleware = paymentMiddleware(
  address,
  {
    '/content/folder1': {
      price: '$0.10',
      config: {
        description: 'Access to folder1 content',
      },
      network,
    },
    '/content/folder2': {
      price: '$0.10',
      config: {
        description: 'Access to folder2 content',
      },
      network,
    },
    '/content/folder3': {
      price: '$0.10',
      config: {
        description: 'Access to folder3 content',
      },
      network,
    },
    '/content/folder4': {
      price: '$0.10',
      config: {
        description: 'Access to folder4 content',
      },
      network,
    },
    '/content/folder5': {
      price: '$0.10',
      config: {
        description: 'Access to folder5 content',
      },
      network,
    },
  },
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

export const middleware = (req: NextRequest) => {
  const delegate = x402PaymentMiddleware as unknown as (
    request: NextRequest,
  ) => ReturnType<typeof x402PaymentMiddleware>
  return delegate(req)
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/', // Include the root path explicitly
  ],
}
