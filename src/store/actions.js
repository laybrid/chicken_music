import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/util'

//选择播放(顺序播放)
export function selectPlay({ commit }, { list, index }) {
    commit('setPlayMode', PLAY_MODE.sequence);
    commit('setSequenceList', list);
    commit('setPlayingState', true);
    commit('setPlayList', list);
    commit('setFullScreen', true);
    commit('setCurrentIndex', index)
}

// 随机播放 洗牌算法
export function randomPlay({ commit }, list) {
    commit('setPlayMode', PLAY_MODE.random);
    commit('setSequenceList', list);
    commit('setPlayingState', true);
    commit('setPlayList', shuffle(list));
    commit('setFullScreen', true);
    commit('setCurrentIndex', 0)
}

// 改变播放模式
export function changeMode({ commit, state, getters }, mode) {
    // 在切换播放模式之前 需要当前放的歌曲存一下 不然切换一次播放模式还自动切歌了
    const currentIndex = getters.currentSong.id
    if (mode === PLAY_MODE.random) {
        commit('setPlayList', shuffle(state.sequenceList))
    } else {
        commit('setPlayList', state.sequenceList)
    }
    const index = state.playList.findIndex((song) => song.id === currentIndex)
    commit('setCurrentIndex', index)
    commit('setPlayMode', mode)
}

// 在歌曲列表删歌
export function removeSong({ commit, state }, song) {
    const sequenceList = state.sequenceList.slice()
    const playList = state.playList.slice()

    const sequenceIndex = findIndex(sequenceList, song)
    const playIndex = findIndex(playList, song)
    sequenceList.splice(sequenceIndex, 1)
    playList.splice(playIndex, 1)

    let currentIndex = state.currentIndex
    // 为什么不是length-1 因为前面已经把歌删了
    if (currentIndex > playIndex || currentIndex === playList.length) {
        currentIndex--
    }

    commit('setSequenceList', sequenceList)
    commit('setPlayList', playList)
    commit('setCurrentIndex', currentIndex)
}

// 在列表添加歌曲
export function addSong({ commit, state }, song) {
    const playlist = state.playList.slice()
    const sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    const playIndex = findIndex(playlist, song)

    if (playIndex > -1) {
        currentIndex = playIndex
    } else {
        playlist.push(song)
        currentIndex = playlist.length - 1
    }

    const sequenceIndex = findIndex(sequenceList, song)
    if (sequenceIndex === -1) {
        sequenceList.push(song)
    }

    commit('setSequenceList', sequenceList)
    commit('setPlayList', playlist)
    commit('setCurrentIndex', currentIndex)
    commit('setPlayingState', true)
    commit('setFullScreen', true)
}

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}