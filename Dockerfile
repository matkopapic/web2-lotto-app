FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend (raw TS)
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
# compile TypeScript to dist inside container
RUN npx tsc

# Copy frontend files into backend/public
COPY --from=frontend-build /app/frontend ./public

# Stage 3: Runtime
FROM node:20-alpine
WORKDIR /app/backend
COPY --from=backend-build /app/backend ./

EXPOSE 3000
CMD ["npm", "run", "start"]