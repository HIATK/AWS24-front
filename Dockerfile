# 1단계: 종속성을 설치하기 위한 빌드 단계
FROM node:18-alpine AS deps

WORKDIR /app

# package.json과 yarn.lock을 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozen-lockfile

# 2단계: 빌드 단계
FROM node:18-alpine AS builder

WORKDIR /app

# 종속성 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (빌드 시 환경에 맞게 설정 가능)
ARG ENV_MODE=production

# Next.js 애플리케이션 빌드
RUN yarn build

# 3단계: 실행 단계
FROM node:18-alpine AS runner

WORKDIR /app

# 빌드 결과물을 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 포트 노출
EXPOSE 3000

# 애플리케이션 시작
CMD ["yarn", "start"]