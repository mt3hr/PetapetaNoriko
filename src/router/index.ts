import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RootPanel from '@/view/PutPullMockRootPage.vue'
import ResetPassword from '@/view/login_system/ResetPassword.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'rootpanel',
    component: RootPanel,
  },
  {
    path: '/reset_password',
    name: 'reset_password',
    component: ResetPassword,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
