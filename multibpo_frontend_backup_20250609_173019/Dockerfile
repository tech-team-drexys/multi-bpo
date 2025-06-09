FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração primeiro (cache optimization)
COPY package.json package-lock.json* ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY index.html ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]