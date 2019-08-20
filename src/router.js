//holds routers
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import DineIn from './views/Dinein'
import DeliveryManagerInit from './views/DeliveryManagerInit'
import DispatchScreenInit from './views/DispatchScreenInit'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '',

  routes: [
    {
      path: '/delivery-manager/:brand_id/:store_id/',
      name: 'DeliveryManager',
      component: DeliveryManagerInit,
    },
    {
      //view dine in
      path: '/:brand_id/:store_id/dine-in',
      name: 'Dinein',
      component: DineIn,
    },
    {
      path: '/:brand_id/:store_id/dine-in/:table_id/:order_id',
      name: 'Home',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/dine-in/:table_id/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/:order_id',
      name: 'Home',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/',
      name: 'BrandHome',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () =>
      // 	import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/dispatch-screen',
      name: 'DispatchScreen',
      component: DispatchScreenInit,
    },
    {
      path: '*',
      name: 'Any',
      component: Home,
    },
  ],
})

Vue.router = router

export default router
