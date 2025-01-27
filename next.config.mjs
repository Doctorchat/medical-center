/** @type {import('next').NextConfig} */
export const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
    /*async rewrites() {
        return isDev
            ? [
                {
                    source: '/api/:path*',
                    destination: 'https://api-dev.doctorchat.md/api/:path*',
                    has: [
                        {
                            type: 'header',
                            key: 'x-proxy-enabled',
                            value: 'true',
                        },
                    ],
                },
                {
                    source: '/api/auth/:path*',
                    destination: '/api/auth/:path*',
                },
            ]
            : [];
    },*/
};

export default nextConfig;
