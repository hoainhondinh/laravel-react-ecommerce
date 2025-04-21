#!/bin/bash

# Script để thiết lập môi trường local với MeiliSearch
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Bắt đầu thiết lập môi trường local...${NC}"

# Kiểm tra Docker đã được cài đặt chưa
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker chưa được cài đặt. Vui lòng cài đặt Docker và Docker Compose trước.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước.${NC}"
    exit 1
fi

# Kiểm tra xem .env file có tồn tại không
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}File .env không tồn tại. Tạo file .env từ .env.example...${NC}"
    cp .env.example .env
    echo "MEILISEARCH_HOST=http://localhost:7700" >> .env
    echo "MEILISEARCH_KEY=masterKey" >> .env
    echo "SCOUT_DRIVER=meilisearch" >> .env
fi

# Khởi động MeiliSearch trong Docker
echo -e "${YELLOW}Khởi động MeiliSearch trong Docker...${NC}"
docker-compose -f docker-compose.meilisearch.yml up -d

# Đợi MeiliSearch khởi động
echo -e "${YELLOW}Đợi MeiliSearch khởi động...${NC}"
sleep 5

# Cài đặt các dependency PHP
echo -e "${YELLOW}Cài đặt các dependency PHP...${NC}"
composer install

# Xóa cache cấu hình
echo -e "${YELLOW}Xóa cache cấu hình...${NC}"
php artisan config:clear

# Kiểm tra kết nối MeiliSearch
echo -e "${YELLOW}Kiểm tra kết nối MeiliSearch...${NC}"
php artisan meilisearch:health

# Cấu hình MeiliSearch
echo -e "${YELLOW}Cấu hình MeiliSearch...${NC}"
php artisan meilisearch:configure

# Nhập dữ liệu vào MeiliSearch
echo -e "${YELLOW}Nhập dữ liệu sản phẩm vào MeiliSearch...${NC}"
php artisan scout:import "App\\Models\\Product"

echo -e "${GREEN}Thiết lập môi trường local thành công!${NC}"
echo -e "Bạn có thể truy cập:
- Web: http://localhost:8000
- MeiliSearch Dashboard: http://localhost:7700
"
