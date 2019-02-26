import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import category from "./modules/category";
import modifier from "./modules/modifier";
import order from "./modules/order";
import sync from "./modules/sync";
import location from "./modules/location";
import orderForm from "./modules/order/form";
import tax from "./modules/tax";
import surcharge from "./modules/surcharge";

//to take snapshot
import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    sync,
    location,
    category,
    modifier,
    orderForm,
    surcharge,
    order,
    tax
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
