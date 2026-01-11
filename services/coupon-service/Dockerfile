# Production Dockerfile for Coupon Service
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY services/coupon-service/package.json ./services/coupon-service/

RUN yarn install --frozen-lockfile

COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
COPY services/coupon-service ./services/coupon-service
COPY tsconfig.json ./

RUN yarn workspace @3asoftwares/types build && \
    yarn workspace @3asoftwares/utils build:backend && \
    cd services/coupon-service && yarn build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/services/coupon-service/dist ./dist
COPY --from=builder /app/services/coupon-service/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
