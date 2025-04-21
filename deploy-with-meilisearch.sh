#!/bin/bash

# Script triển khai dự án với MeiliSearch
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Bắt đầu triển khai ứng dụng...${NC}"

# Đường dẫn đến thư mục dự án
APP_DIR="/var/www/yensaigon"

# Kiểm tra xem đường dẫn có tồn tại không
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}Thư mục $APP_DIR không tồn tại. Vui lòng kiểm tra lại.${NC}"
    exit 1
fi

# Di chuyển đến thư mục dự án
cd $APP_DIR

# Pull code mới từ git
echo -e "${YELLOW}Cập nhật code từ git...${NC}"
git pull origin main

# Cài đặt các dependency PHP
echo -e "${YELLOW}Cài đặt các dependency PHP...${NC}"
composer install --no-dev --optimize-autoloader

# Xóa cache cấu hình
echo -e "${YELLOW}Xóa cache ứng dụng...${NC}"
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Chạy migration (nếu cần)
echo -e "${YELLOW}Chạy migration...${NC}"
php artisan migrate --force

# Thiết lập MeiliSearch
echo -e "${YELLOW}Cấu hình MeiliSearch...${NC}"
bash setup-meilisearch.sh

# Tối ưu ứng dụng
echo -e "${YELLOW}Tối ưu ứng dụng...${NC}"
php artisan optimize

# Khởi động lại các dịch vụ cần thiết
echo -e "${YELLOW}Khởi động lại các dịch vụ...${NC}"
sudo systemctl restart php-fpm
sudo systemctl restart nginx

echo -e "${GREEN}Triển khai hoàn tất!${NC}"
echo -e "Kiểm tra trạng thái MeiliSearch: php artisan meilisearch:health --verbose"
