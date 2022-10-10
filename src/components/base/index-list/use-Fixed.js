import {ref,watch,nextTick,computed} from 'vue'


export default function useFixed(props) {
    const TITLE_HEIGHT = 30;
    const groupRef = ref(null);
    const listHeight = ref([]);
    const scrollY = ref(0);
    let currentIndex = ref(0);
    const distance = ref(0);
    // watch第一个参数写的是回调。。。
    watch(()=>props.singers,async()=>{
        await nextTick();
        calcuate()
    })
    watch(scrollY,newY=>{
        const listHeightValue = listHeight.value;
        for(let i=0;i<listHeightValue.length-1;i++){
            const heightTop = listHeightValue[i];
            const heightBottom = listHeightValue[i+1];
            if(newY>=heightTop&&newY<=heightBottom) {
                currentIndex.value = i;
                distance.value = heightBottom - newY;
            }
        }
    })
    const fixedTitle = computed(()=>{
        if(scrollY.value<0)
        return '';
        const currentGroup = props.singers[currentIndex.value];
        return currentGroup? currentGroup.title:'';
    })
    const fixedStyle = computed(()=>{
        const distanceValue = distance.value;
        const diff = (distanceValue>0&&distanceValue<TITLE_HEIGHT)?          distanceValue - TITLE_HEIGHT : 0;
        return {
            transform:`translate3D(0,${diff}px,0)`
        }
    })
    function calcuate() {
        // 获取到一群dom
        const list = groupRef.value.children;
        const listHeightValue = listHeight.value;

        // 先把起始位置定义好
        let height = 0;
        listHeightValue.push(height);

        for(let i=0;i<list.length;i++){
            height += list[i].clientHeight;
            listHeightValue.push(height);
        }
    }
    function onScroll(pos) {
        // scrollY就是内容头部相超过容器头部的距离
        scrollY.value = -pos.y
    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex
    }
}