import { useStore } from "vuex"
import { computed } from 'vue'
import { save, remove } from '../../assets/js/array-store'
import { FAVORITE_KEY } from '../../assets/js/constant'

export default function useFavorite() {
    const store = useStore()
    const favoriteList = computed(() => store.state.favoriteList)
    const maxLen = 100
    // 处理“最喜欢歌曲的样式”
    function getFavoriteListIcon(song) {
        return isFavoriteList(song) ? 'icon-favorite' : 'icon-not-favorite'
    }
    function isFavoriteList(song) {
        return favoriteList.value.findIndex((item) => item.id === song.id) > -1
    }
    // 处理“数据储存与点击事件”
    function toggleFavorite(song) {
        let list
        if (isFavoriteList(song)) {
            // remove
            list = remove(FAVORITE_KEY, compare)
        } else {
            // save
            list = save(song, FAVORITE_KEY, compare, maxLen)
        }
        store.commit('setFavoriteList', list)
        function compare(item) {
            return song.id == item.id
        }
    }
    return {
        getFavoriteListIcon,
        toggleFavorite
    }
}