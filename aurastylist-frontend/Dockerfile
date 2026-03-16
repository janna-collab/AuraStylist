# Stage 1: Building the application
FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# We use build time env for Next.js public variables if needed
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 2: Serve the application
FROM registry.access.redhat.com/ubi9/nodejs-20:latest AS runner

WORKDIR /app

ENV NODE_ENV production

# Only copy necessary files for runtime
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
