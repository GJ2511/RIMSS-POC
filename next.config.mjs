/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fakestoreapi.com", pathname: "/img/**" },
      { protocol: "https", hostname: "fakestoreapi.com", pathname: "/**" },
      { protocol: "https", hostname: "nextjs.org", pathname: "/**" },
    ],
  },
};

export default nextConfig;
