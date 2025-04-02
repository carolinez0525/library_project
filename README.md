# Backend

## init environment

```bash
# for mac
brew install mysql-client pkg-config
export PKG_CONFIG_PATH="$(brew --prefix)/opt/mysql-client/lib/pkgconfig"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## run server on the local

```bash
python manage.py runserver
```

## Alternative using Docker

Launch dev image
```bash
bash bin/launch_dev_docker.sh
```

Build image
```bash
bash bin/build_image.sh
```

Run server
```bash
python3 src/manage.py runserver 0.0.0.0:8000
```