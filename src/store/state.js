import { PLAY_MODE, FAVORITE_KEY } from '../assets/js/constant'
import { load } from '../assets/js/array-store'
const state = {
    // 顺序歌曲列表
    sequenceList: [],
    // 播放歌曲列表
    playList: [],
    //播放状态
    playing: false,
    //播放模式
    playMode: PLAY_MODE.sequence,
    // 当前歌曲在列表的索引
    currentIndex: 0,
    // 是否开启全屏模式
    fullScreen: false,
    // 喜欢歌曲
    favoriteList: load(FAVORITE_KEY)
}
export default state