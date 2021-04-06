/*
 * @Author: your name
 * @Date: 2020-12-17 09:02:16
 * @LastEditTime: 2021-02-22 15:05:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-5d\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 同步测试
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login'),
      meta: {
        index: 0
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login'),
      meta: {
        index: 1,
        requireAuth: true
      }
    },
    {
      path: '/project-list',
      name: 'ProjectList',
      component: () => import('@/views/project-list'),
      meta: {
        index: 2,
        requireAuth: true
      }
    },
    {
      path: '/home-page',
      name: 'HomePage',
      component: () => import('@/views/home-page'),
      meta: {
        index: 3,
        requireAuth: true
      }
    },
    {
      path: '/project-detail',
      name: 'ProjectDetail',
      component: () => import('@/views/project-detail'),
      meta: {
        index: 4,
        requireAuth: true // 访问页面需要已登录
      }
    },
    {
      path: '/rest-password',
      name: 'RestPassword',
      component: () => import('@/views/rest-password'),
      meta: {
        index: 4,
        requireAuth: true // 访问页面需要已登录
      }
    },
    {
      path: '/delivery-task',
      name: 'deliveryTask',
      component: () => import('@/views/task-list/delivery-task'),
      meta: {
        index: 5,
        requireAuth: true // 访问页面需要已登录
      }
    },
    {
      path: '/review-task',
      name: 'reviewTask',
      component: () => import('@/views/task-list/review-task'),
      meta: {
        index: 5,
        requireAuth: true // 访问页面需要已登录
      }
    }, {
      path: '/acceptance-task',
      name: 'acceptanceTask',
      component: () => import('@/views/task-list/acceptance-task'),
      meta: {
        index: 6,
        requireAuth: true // 访问页面需要已登录
      }
    }, {
      path: '/digital-delivery',
      name: 'digitalDelivery',
      component: () => import('@/views/digital-delivery'),
      meta: {
        index: 7,
        requireAuth: true // 访问页面需要已登录
      }
    }
  ]
})
