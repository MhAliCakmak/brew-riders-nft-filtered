/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.io',"res.cloudinary.com"], // Kullanacağınız hostu burada belirtin
  },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      headers: {
        'Access-Control-Allow-Origin': 'no-cors',
      },
};

export default nextConfig;
