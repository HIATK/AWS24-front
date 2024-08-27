// next.config.js
module.exports = {
    reactStrictMode: false,
    swcMinify:true,
    async rewrites() {
      return [
          {
                  ///api/:path* <-들어갈수있음
              source: '/api/:path*',
              //서버 포트8000에  api/:path api로 시작하는 모든 경로 연결 
              destination: 'http://localhost:8000/api/:path*',
          },
      ];
  },
};
