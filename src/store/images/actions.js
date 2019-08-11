/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import Logger from 'assets/logger'
const logger = new Logger('images.actions')

export async function setupRealtimeUpdates (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
    // find album ids
    const cams = ['cam1', 'cam2', 'cam3', 'cam4']
    const albums = await Promise.all(
      cams.map(async name => {
        const result = await this.$feathers.api.service('albums').find({
          query: {
            $limit: 1,
            name
          }
        })
        if (result.total === 0) throw new Error(`${name} album not found`)
        return result.data[0]._id
      })
    )
    const service = this.$feathers.api.service('images')
    const images = await Promise.all(
      albums.map(async albumId => {
        const result = await service.find({
          query: {
            $limit: 1,
            albumId,
            $sort: {
              timestamp: -1
            }
          }
        })
        return {
          albumId,
          imageId: result.total === 0 ? null : result.data[0]._id
        }
      })
    )
    commit('setCamImages', {
      images
    })
    service.on('created', image => {
      commit('addCamImage', {
        image
      })
    })
  } catch (error) {
    logger.error('setupRealtimeUpdates:', error)
  }
}
