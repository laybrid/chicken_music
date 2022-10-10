import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
export default function useCd() {
    const cdRef = ref(null)
    const cdImageRef = ref(null)
    const store = useStore()
    const playing = computed(() => store.state.playing)
    const isPlaying = computed(() => playing.value ? 'playing' : '')
    watch(playing, (newplaying) => {
        if (!newplaying) {
            syncTransform(cdRef.value, cdImageRef.value)
        }
    })
    function syncTransform(wrapper, inner) {

        const wrapperTransform = getComputedStyle(wrapper).transform
        const innerTransform = getComputedStyle(inner).transform
        wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
    }
    return {
        isPlaying,
        cdRef,
        cdImageRef
    }
}