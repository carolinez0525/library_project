FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y default-libmysqlclient-dev build-essential
RUN apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.11-venv
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
RUN apt-get install -y python3-pip python3.11-dev
RUN apt install -y python3.11-distutils
RUN apt-get install -y gcc curl g++ locales wget zip dmidecode
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11
RUN apt-get install -y --no-install-recommends git
RUN ln -s /usr/bin/python3 /usr/bin/python

ENV MYSQLCLIENT_CFLAGS="-I/usr/include/mysql"
ENV MYSQLCLIENT_LDFLAGS="-L/usr/lib/x86_64-linux-gnu"  

# Install python related packages.
COPY requirements.txt /
RUN pip3 install -r requirements.txt --no-cache-dir


