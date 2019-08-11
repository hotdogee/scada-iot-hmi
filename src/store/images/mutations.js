// import initialState from './state'
// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('logs.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setCamImages (state, { images }) {
  state.camImages = images
}

export function addCamImage (state, { image }) {
  state.camImages.find(i => {
    return i.albumId === image.albumId
  }).imageId = image.imageId
}
