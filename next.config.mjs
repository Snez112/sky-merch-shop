/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: false,
    compress: true,
    experimental: {
        optimizeCss: false,      // Giảm render-blocking CSS
        scrollRestoration: true,
        esmExternals: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
};

export default nextConfig;
