import { get } from './base'

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

export function getLyric(song) {
  const mid = song.mid
  return get('/api/getLyric', {
    mid
  }).then(res => {
      const lyric = res? res.lyric : '[00:00:00]抱歉暂时无法获取歌词'
      return lyric
  }).catch(err => console.log(err))
}