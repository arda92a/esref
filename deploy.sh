#!/bin/bash
# Esref (construction) Production Deploy Script
# Ubuntu/Debian VPS için

set -e

echo "=== Esref Deploy Başlıyor ==="

# En son kodu çek
git pull

# Node.js kur (eğer yoksa)
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# PM2 kur (process manager)
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi

# Bağımlılıkları kur
npm install

# Build al
npm run build

# PM2 ile başlat/yeniden başlat (3001 portunda, diğer siteyle çakışmasın)
pm2 describe esref > /dev/null 2>&1 && pm2 restart esref || pm2 start npm --name "esref" -- start -- -p 3001

pm2 save

echo "=== Deploy Tamamlandı! ==="
echo "Site: http://localhost:3001"
echo "Admin: http://localhost:3001/admin/login"
