## Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install deps with the detected lockfile if available
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm -g install pnpm && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    else npm install; fi

COPY . .
RUN npm run build

## Runtime stage
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default static assets
RUN rm -rf ./*

# Copy built assets
COPY --from=build /app/dist .

# Provide a default nginx config suitable for single-page apps
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
  listen       80;
  server_name  _;
  root   /usr/share/nginx/html;
  index  index.html;

  location / {
    try_files $uri /index.html;
  }

  # Allow passing through to backend API (compose service name: backend)
  location /api/ {
    proxy_pass http://backend:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
