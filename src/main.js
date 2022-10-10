import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式
import '@/assets/scss/index.scss'

// 自定义指令
import loadingDirective from './components/base/loading/directive'
import noResultDirective  from './components/base/no-result/directive'
// 图片懒加载
import lazyPlugin from 'vue3-lazy'

createApp(App).use(store).use(router).directive('loading',loadingDirective).directive('no-result',noResultDirective)
.use(lazyPlugin,{
    loading: require('../src/assets/logo.png')
}).mount('#app')
