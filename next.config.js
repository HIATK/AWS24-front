module.exports = {
    output: 'standalone',
    eslint: {
        // Ignore ESLint errors during builds
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    swcMinify: true,
    async rewrites() {
        return [
            {
                // Matches any API path starting with /api/
                source: '/api/:path*',
                // Redirects to the specified external server
                destination: 'https://dev.moviepunk.p-e.kr/api/:path*',
            },
        ];
    },
};