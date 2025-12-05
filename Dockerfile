# Dockerfile Multi-stage para Frontend + Backend
# Frontend: React/Vite build servido com Nginx
# Backend: PHP 8.1 com Apache

# ============================================
# Stage 1: Build do Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY vite.config.ts ./

# Instalar dependências
RUN npm ci

# Copiar código fonte do frontend
COPY src ./src
COPY index.html ./
COPY tsconfig.json* ./

# Build do frontend
RUN npm run build

# ============================================
# Stage 2: Backend PHP
# ============================================
FROM php:8.1-apache AS backend

# Instalar extensões PHP necessárias
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite do Apache
RUN a2enmod rewrite

# Configurar Apache para servir PHP
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/backend/public\n\
    <Directory /var/www/html/backend/public>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^(.*)$ index.php [QSA,L]\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# ============================================
# Stage 3: Imagem Final
# ============================================
FROM php:8.1-apache

# Instalar extensões PHP
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    nginx \
    && docker-php-ext-install pdo pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Criar diretórios
WORKDIR /var/www/html
RUN mkdir -p /var/www/html/backend/public \
    && mkdir -p /var/www/html/frontend

# Copiar backend do stage anterior
COPY --from=backend /usr/local/etc/php /usr/local/etc/php
COPY backend /var/www/html/backend

# Instalar dependências do backend
WORKDIR /var/www/html/backend
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copiar frontend buildado
COPY --from=frontend-builder /app/build /var/www/html/frontend

# Configurar Apache para backend
RUN echo '<VirtualHost *:8080>\n\
    DocumentRoot /var/www/html/backend/public\n\
    <Directory /var/www/html/backend/public>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^(.*)$ index.php [QSA,L]\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/backend.conf

RUN a2ensite backend.conf

# Configurar Nginx para frontend
RUN echo 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /var/www/html/frontend;\n\
    index index.html;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    location /api {\n\
        proxy_pass http://localhost:8080;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
    \n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Script de inicialização
RUN echo '#!/bin/bash\n\
service apache2 start\n\
nginx -g "daemon off;"' > /start.sh \
    && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]

