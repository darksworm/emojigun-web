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
    fields: {storage: 'none'},
    beforeFirstHit() {
      Vue.$ga.set('anonymizeIp', true);
    },
  });
}

Vue.config.productionTip = false;
Vue.use(VueResource);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

// delete all cookies that were set previously (and shouldn't have been)
setTimeout(function() {
  try {
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  } catch (err) {
    // ..
  }
}, 500);

Vue.prototype.$forceCompute = function(computedName, forceUpdate /* default: true */) {
  if (this._computedWatchers[computedName]) {
    this._computedWatchers[computedName].run();
    if (forceUpdate || typeof forceUpdate == 'undefined') {
        this.$forceUpdate();
    }
  }
}
