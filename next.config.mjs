/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL
    },
    // serverRuntimeConfig: {
    //     BASE_URL: process.env.BASE_URL
    // },
    // publicRuntimeConfig: {
    //     BASE_URL: process.env.BASE_URL
    // },
};

export default nextConfig;
