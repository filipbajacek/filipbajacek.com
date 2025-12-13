#!/bin/bash
# Bezpečný deploy Django projektu

cd /srv/fbwildlife

# 1️⃣ Backup kritických súborov
cp fbwildlife/settings.py backup_settings.py

# 2️⃣ Aktualizácia z GitHub
git fetch origin
git reset --hard origin/main

# 3️⃣ Aktivácia virtuálneho prostredia a inštalácia balíkov
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 4️⃣ Obnova kritických súborov zo zálohy
cp backup_settings.py fbwildlife/settings.py

# 5️⃣ Migrácie a statické súbory
python manage.py migrate
python manage.py collectstatic --noinput

# 6️⃣ Reštart Gunicorn
sudo systemctl daemon-reload
sudo systemctl restart fbwildlife
