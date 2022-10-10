import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('../views/recommend.vue')
const Singer = () => import('../views/singer.vue')
const TopList = () => import('../views/top-list.vue')
const Search = () => import('../views/search.vue')
const SingerDetail = () => import('../views/singer-detail.vue')
const Album = () => import('../views/album.vue')
const TopDetail = () => import('../views/top-detail.vue')
const UseCenter = () => import('../views/use-center.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Album
    }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [{
      path: ':id',
      component: TopDetail
    }]

  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/user',
    components: {
      user: UseCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
