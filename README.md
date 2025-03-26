# backend

## init environment

```bash
# for mac
brew install mysql-client pkg-config
export PKG_CONFIG_PATH="$(brew --prefix)/opt/mysql-client/lib/pkgconfig"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
