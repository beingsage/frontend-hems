FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy ingest worker code
COPY scripts/ingest ./scripts/ingest

# Run the worker
CMD ["node", "scripts/ingest/index.ts"]
