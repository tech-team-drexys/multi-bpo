FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json ./
COPY astro.config.mjs ./
COPY tailwind.config.mjs ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src/ ./src/
# COPY public/ ./public/

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]