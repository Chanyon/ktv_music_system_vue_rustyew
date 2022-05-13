import {request} from './request'

export const getAllSongRoute = (route) => {
    return request({
      url: route,
      method: 'get'
    })
}

export const searchMusicByName = (route, name) => {
  return request({
    url: route,
    method: 'post',
    data:{
      ...name
    }
  })
}