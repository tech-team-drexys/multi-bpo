FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Criar diretório para arquivos estáticos
RUN mkdir -p /app/staticfiles

# Expor porta
EXPOSE 8000

# Comando para desenvolvimento
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]