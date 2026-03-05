/** @type {import('next').NextConfig} */
const ossDomain = process.env.NEXT_PUBLIC_OSS_DOMAIN;

const remotePatterns = [
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '1337',
    pathname: '/uploads/**',
  },
  {
    protocol: 'http',
    hostname: 'cms',
    port: '1337',
    pathname: '/uploads/**',
  },
];

if (ossDomain) {
  remotePatterns.push({
    protocol: 'https',
    hostname: ossDomain,
    pathname: '/**',
  });
}

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns,
    // 禁用 Next 内置图片优化，直接使用远程图片地址
    unoptimized: true,
  },
};

module.exports = nextConfig;
