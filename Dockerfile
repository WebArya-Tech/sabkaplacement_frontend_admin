# Build stage 
FROM node:18-alpine AS builder 

WORKDIR /app 

# Copy package files 
COPY package.json package-lock.json ./ 

# Install dependencies 
RUN npm install 

# Copy source code 
COPY . . 

# Build the application 
RUN npm run build 

# Production stage 
FROM node:18-alpine 

WORKDIR /app 

# Install serve package to run the frontend 
RUN npm install -g serve 

# Copy built application from builder stage 
COPY --from=builder /app/dist ./dist 

# Expose port 9022 
EXPOSE 9022 

# Start serving the application on port 9022
CMD ["serve", "-s", "dist", "-l", "9022"]
