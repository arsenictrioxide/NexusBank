# Stage 1: Build the React Application
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application source and build the Vite project
COPY . .
RUN npm run build


# Stage 2: Serve the application with Nginx Reverse Proxy
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace the default Nginx config with our custom SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to Docker
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
