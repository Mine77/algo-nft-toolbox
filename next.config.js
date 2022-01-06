/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    PURESTAKE_API: process.env.PURESTAKE_API,
    IPFS_API: process.env.IPFS_API,
  }
};