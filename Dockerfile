FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy application files (including server.js)
COPY . .

# Build React production bundle
RUN npm run build

# Expose native port 80 for the Express server
EXPOSE 80

# Start the Node.js backend
CMD ["node", "server.js"]
