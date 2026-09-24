/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
   * /thank-you/ with the slash. Under a static export this is what makes the
   * route emit thank-you/index.html rather than thank-you.html, so the URL
   * resolves on any static host.
   */
  trailingSlash: true,
  // Images are pre-optimised into /public/images by scripts/process-images.mjs
  // and served as static <picture> srcsets, so the runtime optimiser is unused.
  images: { unoptimized: true },
};

export default nextConfig;
