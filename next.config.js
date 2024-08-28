// next.config.js
module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    eslint:{
        //eslint 무시하고 강제로 빌드하는 코드
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    swcMinify:true,
    async rewrites() {
      return [
          {
                  ///api/:path* <-들어갈수있음
              source: '/api/:path*',
              //서버 포트8000에  api/:path api로 시작하는 모든 경로 연결 
              destination: 'http://ec2-3-35-122-73.ap-northeast-2.compute.amazonaws.com:8000/api/:path*',
          },
      ];
  },
};
