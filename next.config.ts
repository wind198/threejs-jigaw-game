import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // file:./packages/core ships raw .ts; Turbopack won't compile node_modules TS otherwise.
  transpilePackages: ['@three-shell/core'],
};
export default nextConfig;
