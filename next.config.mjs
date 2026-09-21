/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Images are pre-optimised into /public/images by scripts/process-images.mjs
  // and served as static <picture> srcsets, so the runtime optimiser is unused.
  images: { unoptimized: true },
};

export default nextConfig;
