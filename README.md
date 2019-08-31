# scada-iot-hmi
> SCADA/IoT Human Machine Interface

# Navigation
* monitor
* analysis
* live
* control
* user
* accounts
* notifications

# Release workflow

```bash
npm run release
git describe
git push --follow-tags origin master
```

* standard-version does the following:
  * bumps the version in metadata files (package.json, composer.json, etc).
  * uses conventional-changelog to update CHANGELOG.md
  * commits package.json (et al.) and CHANGELOG.md
  * tags a new release

# Setup server pm2
npm i -g pm2 spa-http-server

cd scada-iot-supervisor
NODE_ENV=production pm2 start npm --name scada-iot-supervisor -- run start

cd ../scada-iot-hmi
NODE_ENV=production pm2 start npm --name scada-iot-hmi2 -- run start
NODE_ENV=production pm2 start /usr/bin/http-server --name scada-iot-hmi2 -- ./dist -c-1 -p 8083 -d false --push-state

pm2 save

# Nginx config
/etc/nginx/conf.d
server {
    listen      80;
    listen      [::]:80;
    listen      443 ssl http2;
    listen      [::]:443 ssl http2;


    server_name scada.hanl.in;
    client_max_body_size 0;


    ssl_certificate /etc/nginx/ssl/hanl.in/hanl.in.crt;
    ssl_certificate_key /etc/nginx/ssl/hanl.in/hanl.in.key;
    ssl_trusted_certificate /etc/nginx/ssl/hanl.in/ggssl_trusted.crt;


    location /api {
        return 302 /api/;
    }


    location /api/ {
        proxy_pass http://127.0.0.1:8081/; # with trailing slash
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }


    location /media {
        return 302 /media/;
    }


    location /media/ {
        proxy_pass http://127.0.0.1:8085/; # with trailing slash
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }


    location / {
        proxy_pass http://127.0.0.1:8083; # no trailing slash
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;


        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
