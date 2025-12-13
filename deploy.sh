#!/bin/bash
# Deploy 

cd /srv/fbwildlife

# Backup kritických súborov
cp fbwildlife/settings.py backup_settings.py

# Aktualizácia z GitHub
git fetch origin
git reset --hard origin/main

# Aktivácia virtuálneho prostredia a inštalácia balíkov
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Obnova kritických súborov zo zálohy
cp backup_settings.py fbwildlife/settings.py

# Migrácie a statické súbory
python manage.py migrate
python manage.py collectstatic --noinput

# Reštart Gunicorn
sudo systemctl daemon-reload
sudo systemctl restart fbwildlife
