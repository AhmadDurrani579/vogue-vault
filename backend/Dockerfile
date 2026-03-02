FROM python:3.10-slim

# 1. Setup User (UID 1000 is mandatory for HF)
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    # Explicitly point to the user's home directory
    HF_HOME=/home/user/.cache \
    TRANSFORMERS_CACHE=/home/user/.cache

# 2. Vision Dependencies (Run as root)
USER root
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Pre-create the cache directory and ensure the 'user' owns it
RUN mkdir -p /home/user/.cache && chown -R user:user /home/user/.cache

WORKDIR /home/user/app

# 3. Install Requirements
# Copying as root first, then changing ownership
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 4. Copy Code and fix permissions
COPY . .
RUN chown -R user:user /home/user/app

# Switch back to the non-privileged user for security
USER user

# 5. Startup Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]