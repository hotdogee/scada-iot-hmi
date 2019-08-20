// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('logs.getters')
/*
export function someGetter (state) {
}
*/
export function camImagesSrc (state, getters) {
  return state.camImages.map(i => {
    return i.imageId
      ? `${process.env.API_URL}${process.env.API_PATH}/images/${i.imageId}?$client[raw]=1&$client[format]=jpg`
      : ''
  })
}
