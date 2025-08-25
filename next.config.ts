import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
<<<<<<< HEAD
  // Performance optimizations
  devIndicators: false,
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Compress responses with gzip
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
=======
>>>>>>> aec7a1f9ed59d9ba526cc27cd042379283eac6a7
};

export default nextConfig;
