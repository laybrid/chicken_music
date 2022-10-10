import { computed,ref } from "vue";

export default function useShortcut(props,gruopRef) {
  const ANCHOR_HEIGHT = 18
  const scroll = ref(null);
  const shortList = computed(()=>{
    return props.singers.map((item)=>{
        return item.title
    })
  })

  //闭包取值技巧
  const touch = {};
  function onShortcutTouchStart(e){
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY;
    // 起始位置的索引和纵坐标存一下
    touch.anchorIndex = anchorIndex;
    Toscroll(anchorIndex);
  }
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    // 得到偏移索引
    const delta = Math.floor((touch.y2-touch.y1) / ANCHOR_HEIGHT);
    const anchorIndex = delta + touch.anchorIndex
    Toscroll(anchorIndex);
  }
  function Toscroll(index) {
    // 用户无效拖动后index会变成NaN  
    if(isNaN(index)){
          return
      }
    // index值不能随便拖 所以做一个限定
    index = Math.max(0,Math.min(shortList.value.length-1,index));
    const targetEl = gruopRef.value.children[index];
    scroll.value.scroll.scrollToElement(targetEl,0)
  }
  return {
      shortList,
      scroll,
      onShortcutTouchStart,
      onShortcutTouchMove
  }
}