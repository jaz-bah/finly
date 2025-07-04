import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
}

export default withPWA(pwaConfig)(nextConfig as any)