import {request} from './request'

export const getAllSongRoute = (route) => {
    return request({
      url: route,
      method: 'get'
    })
}