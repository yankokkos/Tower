# Dockerfile na raiz para o Coolify
# Este arquivo referencia o backend/

# Nome da imagem (usado pelo Coolify)
# ARG BUILDKIT_INLINE_CACHE=1

FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências do backend
COPY backend/package.json ./
COPY backend/package-lock.json* ./

# Instalar dependências (usa npm install se não houver package-lock.json)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copiar código fonte do backend
COPY backend/ .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção
COPY backend/package.json ./
COPY backend/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi && npm cache clean --force

# Copiar arquivos compilados do stage de build
COPY --from=builder /app/dist ./dist

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Mudar ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar
CMD ["node", "dist/index.js"]

