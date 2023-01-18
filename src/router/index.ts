import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RootPanel from '@/view/PutPullMockRootPage.vue'
import Login from '@/view/share_view_system/Login.vue'
import ResetPassword from '@/view/share_view_system/ResetPassword.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'rootpanel',
    component: RootPanel,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/reset_password',
    name: 'reset_password',
    component: ResetPassword,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
