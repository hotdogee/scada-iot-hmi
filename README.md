# scada-iot-hmi

> SCADA/IoT Human Machine Interface

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8081
$ quasar dev

# build for production with minification
$ quasar build

# lint code
$ quasar lint
```

# Setup server pm2
cd scada-iot-supervisor
NODE_ENV=production pm2 start npm --name scada-iot-supervisor -- run start

cd ../scada-iot-hmi
quasar build
NODE_ENV=production pm2 start /usr/bin/http-server --name scada-iot-hmi -- ./dist -p 8303 -d false
