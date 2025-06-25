# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Create startup script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'npx prisma migrate deploy' >> start.sh && \
    echo 'npx prisma db seed' >> start.sh && \
    echo 'npm start' >> start.sh && \
    chmod +x start.sh

# Start the application
CMD ["./start.sh"] 