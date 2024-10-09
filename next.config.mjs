/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com"
      },
      {
        hostname: "utfs.io"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/users",
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
