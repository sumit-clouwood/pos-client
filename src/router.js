//holds routers
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import DineIn from './views/Dinein'
import DeliveryManagerInit from './views/DeliveryManagerInit'
import DispatchScreenInit from './views/DispatchScreenInit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
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
      path: '/dine-in',
      name: 'Dinein',
      component: DineIn,
    },
    {
      path: '/delivery-manager',
      name: 'DeliveryManager',
      component: DeliveryManagerInit,
    },
    {
      path: '/ds',
      name: 'DispatchScreen',
      component: DispatchScreenInit,
    },
  ],
})
