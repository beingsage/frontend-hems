FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY scripts/simulator ./scripts/simulator

CMD ["node", "scripts/simulator/index.ts"]
