# --- Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# Optionally copy env files
# COPY --from=builder /app/.env.production ./.env.production

EXPOSE 5000
ENV PORT=5000

CMD ["npm", "start"]