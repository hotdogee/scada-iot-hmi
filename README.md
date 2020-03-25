# scada-iot-hmi

> SCADA/IoT Human Machine Interface

Cross platform real-time monitor and statistics of Well enthalpy, Thermal efficiency, Fluid Temperature, Pipe Pressure, Mass Flow Rate, Three Phase Power, Voltage, Current, Harmonics.
Fast historic data viewer and analysis of more than 1 billion data points.
Live camera feed from the plant.
Front end PWA built with VueJS, real-time communication with NodeJS back end with WebSockets, Historical data storage with MongoDB, on-site software defined PLC using multiple Raspberry Pi.

# Navigation

- monitor
- analysis
- live
- control
- user
- accounts
- notifications

# Development workflow

```bash
# Debug server
npm run dev
# build
npm run build
```

# Release workflow

```bash
npm run release
git describe
git push --follow-tags origin master
```

- standard-version does the following:
  - bumps the version in metadata files (package.json, composer.json, etc).
  - uses conventional-changelog to update CHANGELOG.md
  - commits package.json (et al.) and CHANGELOG.md
  - tags a new release

```bash
# 2650v1
cd /opt/scada-iot/scada-iot-hmi/
git stash
git pull
npm run build
```

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
listen 80;
listen [::]:80;
listen 443 ssl http2;
listen [::]:443 ssl http2;

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
