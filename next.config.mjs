/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["undici", "firebase", "date-fns"],
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
