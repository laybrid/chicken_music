import {get} from './base'

export function getSingerList() {
    return get('/api/getSingerList')
}

export function getSingerDetail(Singer) {
    return get('/api/getSingerDetail',{
        mid: Singer.mid
    })
}