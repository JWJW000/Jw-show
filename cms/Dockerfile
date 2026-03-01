FROM node:20-alpine AS base
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache vips vips-dev
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 strapi && adduser --system --uid 1001 strapi
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
RUN mkdir -p public/uploads && chown -R strapi:strapi public /app
USER strapi
EXPOSE 1337
CMD ["npm", "run", "start"]