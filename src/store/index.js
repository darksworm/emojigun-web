import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedEmojis: {},
    generatingZip: false
  },
  mutations: {
    selectEmoji(state, emoji) {
      Vue.set(state.selectedEmojis, emoji.url, emoji);
    },
    deselectEmoji(state, emoji) {
      Vue.delete(state.selectedEmojis, emoji.url);
    },
    clearSelection(state) {
      Vue.delete(state, "selectedEmojis");
      Vue.set(state, "selectedEmojis", {});
    },
    generationStarted(state) {
      Vue.set(state, "generatingZip", true);
    },
    generationEnded(state) {
      Vue.set(state, "generatingZip", false);
    }
  },
  getters: {
    isEmojiSelectedByURL: state => url => {
      return Object.keys(state.selectedEmojis).indexOf(url) !== -1;
    },
    selectedEmojis(state) {
      return state.selectedEmojis;
    },
    selectedEmojiCount(state) {
      return state.selectedEmojis.length;
    },
    generatingZip(state) {
      return state.generatingZip;
    }
  },
  actions: {},
  modules: {}
});
