/* eslint-disable no-console */
//holds routers
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Transactions from './views/Transactions'
import DineIn from './views/Dinein'
import DeliveryManagerInit from './views/DeliveryManagerInit'
import DispatchScreenInit from './views/DispatchScreenInit'
import CashierLogin from './views/CashierLogin'
import Carhop from './views/Carhop'
import UserProfile from './views/UserProfile.vue'
import Store from './store/index'

Vue.use(Router)
//Routes match from top to bottom, if top matched, it ll not go down
const router = new Router({
  mode: 'history',
  base: '',

  routes: [
    ///5d6cff2d7dc7bf003d15f06b/5d6cff407dc7bf003d15f138/crm-order/5de29617e33e87000c0229de/5de29617e33e87000c0229dd
    // http://localhost:8081/5d012569ae34d800185c67f4/5d012577ae34d800185c6927/crm-order/5daabf8ea777da353f4a9b95/5daabf8ea777da353f4a9b94/group/id-isss
    {
      path:
        '/:brand_id/:store_id/crm-order/:customer_id/:address_id/group/:group_id',
      name: 'selectGroupForCrmOrder',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/crm-order/:customer_id/:address_id',
      name: 'selectAddressForCrmOrder',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/order-type/:order_type',
      name: 'setOrderType',
      component: Home,
    },
    // {
    //   path: '/:iosprinter',
    //   name: 'iosApplication',
    //   component: Home,
    // },
    {
      path: '/cashier-login/:brand_id',
      name: 'cashierLogin',
      component: CashierLogin,
    },
    {
      path: '/:brand_id/:store_id/update/:order_id',
      name: 'ModifyBackendOrder',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/transactions',
      name: 'Transactions',
      component: Transactions,
    },
    {
      path: '/delivery-manager/:brand_id/:store_id/',
      name: 'DeliveryManager',
      component: DeliveryManagerInit,
    },
    {
      path: '/user-details/:brand_id/:store_id',
      name: 'userDetails',
      component: UserProfile,
    },
    {
      path: '/carhop/:brand_id/:store_id',
      name: 'Carhop',
      component: Home,
    },
    {
      path: '/carhop-orders/:brand_id/:store_id',
      name: 'CarhopOrders',
      component: Carhop,
    },
    {
      path: '/carhop/:brand_id/:store_id/:order_id',
      name: 'CarhopOrderPay',
      component: Home,
    },
    {
      //view dine in
      path: '/dine-in/:brand_id/:store_id',
      name: 'Dinein',
      component: DineIn,
    },
    {
      path: '/dine-in/:brand_id/:store_id/:table_id/:order_id',
      name: 'DineinOrder',
      component: Home,
    },
    {
      path: '/dine-in/:brand_id/:store_id/:table_id/',
      name: 'DineinTable',
      component: Home,
    },
    {
      path: '/:brand_id/:store_id/:order_id',
      name: 'UpdateDeliveryOrder',
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
      path: '/:brand_id/:store_id/',
      name: 'BrandHome',
      component: Home,
    },
    {
      path: '*',
      name: 'HomeDefault',
      component: Home,
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log('Routing going to be ', to.name)
  //if to is switch cashier, we should reset all the data
  if (to.name === 'cashierLogin') {
    //we need brand id for switch cashier so preserve it
    Store.dispatch('auth/logout', { preserve: ['brand_id', 'store_id'] })
    next()
  } else {
    //resolve immediately
    next()
  }
})

Vue.router = router

export default router
