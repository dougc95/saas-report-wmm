# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production Stage
FROM node:16-alpine
WORKDIR /app
# Copy build artifacts from the builder stage
COPY --from=builder /app/dist ./dist
# Or if using create-react-app, copy build folder:
# COPY --from=builder /app/build ./build
EXPOSE 3000
# You can serve static with a lightweight server like serve
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
