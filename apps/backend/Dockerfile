FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client curl

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies without running postinstall script
RUN npm ci --ignore-scripts && npm cache clean --force

# Now generate Prisma client after schema is available
RUN npx prisma generate

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
set -e

echo "Starting backend application..."
echo "Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U kane -d mydb; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"
echo "Running database migrations..."
npx prisma migrate deploy
echo "🌱 Seeding database..."
npx prisma db seed || echo "Seeding failed, continuing anyway..."

echo "Starting the server..."
npm start
EOF

RUN chown -R backend:nodejs /app && chmod +x /app/start.sh
USER backend

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["/app/start.sh"] 