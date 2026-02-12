# Build stage
FROM node:18-bookworm AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Build TypeScript to JavaScript
RUN npm run build

# Production stage
FROM node:18-bookworm-slim

WORKDIR /app

# Install required tools for migrations and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    postgresql-client \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy environment files
COPY .env.example ./
    
    # Only copy .env if it exists (for local development)
    # For production, env vars should be passed at runtime
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Expose API port
EXPOSE 3000

# Use dumb-init to run node (proper signal handling)
ENTRYPOINT ["dumb-init", "--"]

# Start with entrypoint script for migrations, then run app
CMD ["./docker-entrypoint.sh", "node", "dist/index.js"]
