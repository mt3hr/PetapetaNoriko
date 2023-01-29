import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RootPanel from '@/view/PutPullMockRootPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'rootpanel',
    component: RootPanel,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
