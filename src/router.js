//holds routers
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import DineIn from './views/Dinein'
import DeliveryManagerInit from './views/DeliveryManagerInit'
import DispatchScreenInit from './views/DispatchScreenInit'
import NotFoundComponent from './views/NotFoundComponent'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '',

  routes: [
    //for development
    {
      path: '/pos/:brand_id/:store_id/',
      name: 'PosBrandHomeDev',
      component: Home,
    },
    //for live where this app is hosted under /pos
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
      path: '/dine-in',
      name: 'Dinein',
      component: DineIn,
    },
    {
      path: '/delivery-manager/:brand_id/:store_id/',
      name: 'DeliveryManager',
      component: DeliveryManagerInit,
    },
    {
      path: '/dispatch-screen',
      name: 'DispatchScreen',
      component: DispatchScreenInit,
    },
    { path: '*', component: NotFoundComponent },
  ],
})

Vue.router = router

export default router
