# --- Stage 1: Base (Chuẩn bị môi trường chung) ---
# Sử dụng Node 20 Alpine cho nhẹ (phù hợp với version local v20.19.4 của bạn)
FROM node:20-alpine AS base
WORKDIR /app

# --- Stage 2: Dependencies (Cài đặt thư viện) ---
FROM base AS deps
# Copy package.json và package-lock.json trước
# Mục đích: Docker sẽ cache layer này. Nếu code thay đổi nhưng thư viện không đổi,
# nó sẽ bỏ qua bước npm ci -> build siêu nhanh cho CI/CD.
COPY package*.json ./

# Dùng npm ci thay vì npm install để đảm bảo version chính xác theo lockfile
# --only=production: Bỏ qua các gói devDependencies (như nodemon) để giảm dung lượng
RUN npm ci --only=production

# --- Stage 3: Runner (Image chạy thực tế) ---
FROM base AS runner

# Thiết lập môi trường là production
ENV NODE_ENV=production

# Tạo user/group hệ thống (đã có sẵn trong node image) nhưng ta khai báo lại quyền
# Chạy app bằng user 'node' thay vì 'root' để đảm bảo bảo mật (Security Best Practice)
USER node

# Copy thư mục node_modules từ stage deps sang
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy source code của ứng dụng
# --chown=node:node: Đảm bảo user 'node' có quyền đọc/ghi file
COPY --chown=node:node . .

# Expose port (Khớp với PORT 5000 trong file .env của bạn)
EXPOSE 5000

# Khởi chạy ứng dụng
# Dùng exec form ["..."] để app nhận được các tín hiệu hệ thống (như Ctrl+C, SIGTERM)
CMD ["node", "app.js"]