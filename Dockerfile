# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy both package files to leverage Docker caching
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN cd frontend && npm ci

# Copy source directories so relative imports resolve
COPY frontend/ ./frontend/
COPY backend/ ./backend/

RUN cd frontend && npm run build

# Stage 2: Build Node.js Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Final Production Container
FROM node:20-alpine
WORKDIR /app

# Copy built backend files and node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy built frontend static files to backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./backend/dist/public

# Configure production environment
ENV PORT=8080
ENV NODE_ENV=production
ENV DB_FILE_PATH=/data/database.json

WORKDIR /app/backend
EXPOSE 8080

CMD ["node", "dist/index.js"]
