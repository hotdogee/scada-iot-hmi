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
cd scada-iot-hmi
quasar build
sudo pm2 start /usr/bin/http-server --name hmi -- ./dist -p 8600 -d false
