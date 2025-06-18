# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY book_reviews-front/package.json book_reviews-front/package-lock.json* ./
RUN npm ci

COPY book_reviews-front .
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .

EXPOSE 3000
CMD [ "node", "./.next/standalone/server.js" ]
