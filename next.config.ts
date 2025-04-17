import type { NextConfig } from "next";
const IS_DEV = process.env.NEXT_PUBLIC_IS_DEV === 'true';

const basePath =  IS_DEV ? '' : "/painel/link"

const nextConfig: NextConfig = {
  basePath: basePath,
  trailingSlash: true, // opcional, mas ajuda com / no final das URLs
};

export default nextConfig;
