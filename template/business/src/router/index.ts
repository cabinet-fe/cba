import { createRouter, createWebHistory } from 'vue-router'
import { Layout, Login, NoAuth, NotFound } from '@ic/pages'
import { guard } from './guard'
import {
  HOME_NAME,
  LOGIN_NAME,
  NOT_FOUND_NAME,
  NO_AUTH_NAME
} from '@meta/shared/route'
import { routes } from './routes'

export const router = createRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      name: HOME_NAME,
      meta: {
        title: '首页'
      }
    },

    ...routes,

    { path: '/login', name: LOGIN_NAME, component: Login },
    { path: '/no-auth', name: NO_AUTH_NAME, component: NoAuth },

    /** 匹配任意路径的路由，会直接进入404页面 */
    { path: '/:path(.*)*', name: NOT_FOUND_NAME, component: NotFound }
  ],

  history: createWebHistory('/')
})

guard(router)
