# Use official Node.js LTS image as the base
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package.json package-lock.json ./

# Install all dependencies, including dev dependencies (needed for build)
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --omit=dev

# Expose the port your app runs on
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]