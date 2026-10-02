/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    // Atenção: Isto desativa o ESLint durante o build de produção (para não travar o deploy por warnings)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
