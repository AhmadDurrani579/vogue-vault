FROM python:3.10-slim

# 1. Setup User (Hugging Face requires UID 1000)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    # CRITICAL: Set cache directories to the user's home
    TRANSFORMERS_CACHE=$HOME/.cache \
    HF_HOME=$HOME/.cache

WORKDIR $HOME/app

# 2. Vision Dependencies (Debian Trixie compatible)
USER root
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create cache dir and give user full permissions
RUN mkdir -p $HOME/.cache && chown -R user:user $HOME/.cache
USER user

# 3. Install Requirements
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 4. Copy Code
COPY --chown=user . .

# 5. Startup Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]