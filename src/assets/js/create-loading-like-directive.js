import {createApp} from 'vue'
import { addClass,removeClass} from './dom'
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
    const name = Comp.name
    return {
        mounted(el,binding) {
            const app = createApp(Comp);
            // instance代表的是loading组件
            const instance = app.mount(document.createElement('div'));
            if(!el[name]){
                el[name] = {}
            }
            el[name].instance = instance;
            // 拿到指令的动态参数
            const title = binding.arg;
            if(typeof title !== 'undefined'){
                instance.setTitle(title);
            }
            if(binding.value){
                append(el);
            }
        },
        updated(el,binding) {
            const title = binding.arg;
            if(typeof title != 'undefined'){
                el[name].instance.setTitle(title);
            }
            if(binding.value != binding.oldValue){
                binding.value? append(el) : remove(el);
            }
        },
    }
    function append(el){
        const style = getComputedStyle(el)
        if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
          addClass(el, relativeCls)
        }
        el.appendChild(el[name].instance.$el)
    }
    function remove(el){
        removeClass(el, relativeCls)
        el.removeChild(el[name].instance.$el)
    }
}
