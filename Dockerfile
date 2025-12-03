FROM node:20-alpine

WORKDIR /app

# Установите build tools сразу
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    chromium \
    ca-certificates \
    nss \
    freetype \
    freetype-dev \
    harfbuzz

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy app
COPY . .

EXPOSE 3000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD ["npm", "start"]