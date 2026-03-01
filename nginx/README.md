# Nginx 配置说明

## 1. 部署结构

- **主站（作品展示）**：`www.yourdomain.com` → 反向代理到本机 `3001`（Next.js）
- **后台（Strapi）**：`cms.yourdomain.com` → 反向代理到本机 `1337`（Strapi）

## 2. 在服务器上配置

### 2.1 安装 Nginx（Ubuntu/Debian）

```bash
sudo apt update
sudo apt install nginx -y
```

### 2.2 使用本配置

```bash
# 复制示例并改为你的域名
sudo cp nginx.conf.example /etc/nginx/sites-available/jw-show
sudo sed -i 's/yourdomain.com/你的实际域名/g' /etc/nginx/sites-available/jw-show

# 启用站点
sudo ln -sf /etc/nginx/sites-available/jw-show /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

或手动编辑：

```bash
sudo nano /etc/nginx/sites-available/jw-show
# 把 yourdomain.com 全部替换为你的域名，保存后：
sudo ln -sf /etc/nginx/sites-available/jw-show /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 2.3 配置 HTTPS（推荐）

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d www.yourdomain.com -d yourdomain.com -d cms.yourdomain.com
```

按提示选择是否重定向 HTTP 到 HTTPS。之后证书会自动续期。

### 2.4 环境变量（生产）

在项目根目录 `.env` 中设置前端访问 CMS 的**公网地址**（用于浏览器请求和 Strapi 后台资源）：

```env
NEXT_PUBLIC_STRAPI_URL=https://cms.yourdomain.com
```

若用 Docker Compose，需在 `docker-compose.yml` 的 frontend 的 `environment` 里写上该变量，然后重新构建并启动：

```bash
docker compose up -d --build
```

## 3. 仅一个域名时（可选）

若只有主域名、没有子域名，可以把后台放在路径下，例如 `www.yourdomain.com/cms`：

- 需要改 Nginx：`location /cms/ { proxy_pass http://127.0.0.1:1337/; ... }`
- 还需在 Strapi 中配置 `config/server.js` 的 `url` 为 `https://www.yourdomain.com/cms`，并可能调整 admin 路径，较繁琐。**更推荐使用子域名** `cms.yourdomain.com`。

## 4. 防火墙

若用 ufw：

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

不需要对 3001、1337 放行，只通过 Nginx 的 80/443 访问即可。
