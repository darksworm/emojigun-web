import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedEmojis: {}
  },
  mutations: {
    selectEmoji(state, emoji) {
      Vue.set(state.selectedEmojis, emoji.url, emoji);
    },
    deselectEmoji(state, emoji) {
      Vue.delete(state.selectedEmojis, emoji.url);
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
    }
  },
  actions: {},
  modules: {}
});
