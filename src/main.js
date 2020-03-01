import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import config from '../config.json';

if (config.env === 'production') {
  Sentry.init({
    dsn: config.sentryDSN,
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
  });

  Vue.use(VueAnalytics, {
    id: config.googleAnalyticsID,
    router,
  });
}

Vue.config.productionTip = false;
Vue.use(VueResource);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
