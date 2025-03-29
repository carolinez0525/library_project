FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

ENV TZ=UTC

# Install required dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libmysqlclient-dev \
    pkg-config \
    gcc \
    g++ \
    python3.11 \
    python3.11-dev \
    python3.11-distutils \
    python3-pip \
    curl \
    git \
    wget \
    zip \
    tzdata \
    && rm -rf /var/lib/apt/lists/*


# Set timezone environment variable
ENV TZ=UTC

# Set Python 3.11 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    ln -sf /usr/bin/python3 /usr/bin/python

# Upgrade pip
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

# Copy and install Python packages
COPY requirements.txt /
RUN pip install --no-cache-dir -r /requirements.txt

# Copy project files
COPY src /backend/src

# Set working directory
ENV PYTHONPATH="/backend/src"
WORKDIR /backend

# Default command (optional)
# CMD ["python3", "src/manage.py", "runserver", "0.0.0.0:8000"]
