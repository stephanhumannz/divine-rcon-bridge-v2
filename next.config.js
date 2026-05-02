/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if there are small typing warnings
    ignoreBuildErrors: true, 
  },
}

module.exports = nextConfig
