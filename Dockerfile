# ─────────────────────────────────────────────────────────
#  Admin Panel Frontend — Dockerfile (panel4)
#  Development and Production build
# ─────────────────────────────────────────────────────────

FROM node:20-alpine

# Set metadata labels
LABEL maintainer="Job Portal Team"
LABEL description="Admin Panel Frontend"
LABEL version="1.0.0"

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
