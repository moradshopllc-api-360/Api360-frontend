/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable React Compiler (from .mjs config)
  reactCompiler: true,

  // Configure compiler to handle hydration issues
  compiler: {
    // Remove console warnings in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configure headers for security
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],

  // Redirects for dashboard (from .mjs config)
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/default',
        permanent: false,
      },
    ];
  },

  // Custom webpack configuration to handle hydration issues
  webpack: (config, { dev, isServer }) => {
    // Ignore hydration warnings in development
    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        if (entries['main.js'] && !entries['main.js'].includes('./hydration-patch.js')) {
          entries['main.js'].unshift('./hydration-patch.js');
        }

        return entries;
      };
    }
    return config;
  },

  // Add empty turbopack config to resolve webpack/turbopack conflict
  turbopack: {},
};

module.exports = nextConfig;