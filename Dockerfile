FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Install Puppeteer dependencies
RUN apk add --no-cache \
    chromium \
    ca-certificates

# Copy app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
