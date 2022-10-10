import MusicList from '../../components/music-list/music-list.vue'
import storage from 'good-storage'
import { processSongs } from '../../service/song'
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    components: {
      MusicList
    },
    async created() {
      // 防止有人乱改路由参数
      if (this.computedData == null) {
        const path = this.$route.matched[0].path;
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(this.computedData);
      // 先通过歌手得到歌再通过歌得到歌的url
      this.songs = await processSongs(result.songs);
      this.loading = false;
    },
    computed: {
      computedData() {
        let ret = null;
        let data = this.data;
        if (data) {
          ret = data
        } else {
          const cache = storage.session.get(key);
          if (cache && (cache.mid || cache.id + '') === this.$route.params.id) {
            ret = cache
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData;
        return data && data.pic;
      },
      title() {
        const data = this.computedData;
        return data && (data.name || data.title)
      }
    }
  }
}