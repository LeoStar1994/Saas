import Vue from "vue";
import App from "./App.vue";
import { initRouter } from "./router";
import "./theme/index.less";
import Antd from "ant-design-vue";
import Viser from "viser-vue";
import "@/mock";
import store from "./store";
import "animate.css/source/animate.css";
import Plugins from "@/plugins";
import { initI18n } from "@/utils/i18n";
import bootstrap from "@/bootstrap";
import "./less/style.less";
import Loading from "./components/loading/Loading.vue";
import { isEmpty, isRihgtPhone } from "@/utils/util";
Vue.prototype.$isEmpty = isEmpty;
Vue.prototype.$isRihgtPhone = isRihgtPhone;

const router = initRouter(store.state.setting.asyncRoutes);
const i18n = initI18n("CN", "US");

Vue.component("loading", Loading);

Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(Viser);
Vue.use(Plugins);

bootstrap({ router, store, i18n, message: Vue.prototype.$message });

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
