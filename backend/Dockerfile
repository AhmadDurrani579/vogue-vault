FROM python:3.10-slim

# 1. Setup User (Still required for HF security)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# 2. Vision Dependencies (Still needed for CLIP/Pillow)
USER root
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
USER user

# 3. Install Requirements
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# 4. Copy Code
COPY --chown=user . .

# 5. The Pure FastAPI Command
# Replace 'main:app' with 'app:app' if your file is named app.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]