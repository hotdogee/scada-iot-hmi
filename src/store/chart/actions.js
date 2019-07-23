/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import Logger from 'assets/logger'
const logger = new Logger('chart.actions')

// export async function skipWaiting (
//   { commit, dispatch, state, getters, rootState, rootGetters },
//   payload = { type: 'SKIP_WAITING' }
// ) {
//   try {
//     // Send a message telling the service worker to skip waiting.
//     // This will trigger the `controlling` event handler
//     const wb = new Workbox(process.env.SERVICE_WORKER_FILE)
//     await wb.register()
//     wb.messageSW(payload)
//   } catch (error) {
//     logger.error('skipWaiting:', error)
//   }
// }
export async function findLogsInRange (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  // const t0 = performance.now()
  let url = `${process.env.API_URL}${process.env.API_PATH}/logs?$client[chart]=true`
  if (payload.from) {
    const from = new Date(payload.from).toISOString()
    url += `&logTime[$gt]=${from}`
  }
  if (payload.to) {
    const to = new Date(payload.to).toISOString()
    url += `&logTime[$lt]=${to}`
  }
  const chartLogs = await (await fetch(url)).json()
  // console.log('time1:', ((performance.now() - t0) / 1000).toFixed(2), url)
  // console.log(`bucket: ${chartLogs.bucket}`)
  logger.info('chartLogs:', chartLogs)
  commit('setBucket', {
    bucket: chartLogs.bucket
  })
  payload.done(chartLogs)
}

export async function getLogsCountInRange (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  // getChartData({from: from, to: to})
  // console.log('store.dispatch - findLogs')
  const params = {
    query: {
      $limit: 0,
      logTime: {
        $gt: new Date(payload.from).toISOString(),
        $lt: new Date(payload.to).toISOString()
      }
    }
  }
  // params = {
  //   query: {
  //     $limit: 0,
  //     logTime: {"$gt":"2017-08-07T20:39:30.088Z","$lt":"2019-07-23T21:24:59.216Z"}
  //   }
  // }
  // > use scada-iot
  // > db.logs.getIndexKeys()
  // > db.logs.find({logTime:{"$gt":ISODate("2017-08-07T20:39:30.088Z"),"$lt":ISODate("2019-07-23T21:24:59.216Z")}}).count()
  // > db.logs.find({logTime:{"$lt":ISODate("2019-07-23T21:24:59.216Z"),"$gt":ISODate("2017-08-07T20:39:30.088Z")}}).sort({logTime:-1}).count()
  // > db.logs.find({logTime:{"$gt":ISODate("2017-08-07T20:39:30.088Z"),"$lt":ISODate("2019-07-23T21:24:59.216Z")}}).explain()
  logger.info('getLogsCountInRange:', params)
  commit('setTotal', {
    total: -1
  })
  try {
    // document.getElementById('q-app').__vue__.$feathers.api.service('logs').find(params)
    const service = this.$feathers.api.service('logs')
    const results = await service.find(params)
    commit('setTotal', {
      total: results.total
    })
  } catch (error) {
    logger.error('getLogsCountInRange:', error)
  }
}
