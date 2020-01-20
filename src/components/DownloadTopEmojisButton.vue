<template>
  <div @click="downloadTopEmojis()"><slot></slot></div>
</template>

<script>
import Vue from 'vue';
import Emoji from './Emoji';
import downloadZipOfFiles from '../mixins/downloader.js';

export default {
  name: '',
  methods: {
    downloadTopEmojis() {
      let files = [];
      let promises = {};
      let emotePromises = [];

      let store = this.$store;

      store.commit('generationStarted');

      let getEmojiFile = function(name, urls) {
        let EmojiComponentClass = Vue.extend(Emoji);
        let emojiComponent = new EmojiComponentClass({
          propsData: {
            name: name,
            urls: urls,
          },
        });

        return emojiComponent.getFile();
      };

      for (let page = 1; page <= 3; page++) {
        let ffzPromise = Vue.http
          .get(
            'https://api.frankerfacez.com/v1/emoticons?sort=count&per_page=200&page=' +
              page,
          )
          .then(function(response) {
            response.body.emoticons.map(x => {
              let promise = getEmojiFile(x.name, x.urls).then(function(file) {
                files.push(file);
              });

              emotePromises.push(promise);
            });
          });

        promises['ffz' + page] = ffzPromise;
      }

      Vue.http
        .get(
          'https://api.streamelements.com/kappa/v2/chatstats/global/stats?limit=100',
        )
        .then(function(resp) {
          for (let emote of resp.body.ffzEmotes) {
            let promise = Vue.http
              .get('https://api.frankerfacez.com/v1/emote/' + emote.id)
              .then(
                function(loadedEmote) {
                  let promise = getEmojiFile(
                    loadedEmote.body.emote.name,
                    loadedEmote.body.emote.urls,
                  ).then(function(file) {
                    files.push(file);
                  });

                  emotePromises.push(promise);
                },
                function() {
                  // if a request fails there is not much we can do
                  delete promises[emote.id];
                },
              );

            promises[emote.id] = promise;
          }

          return Promise.all(Object.values(promises)).then(function() {
            return Promise.all(emotePromises).then(function() {
              return downloadZipOfFiles(files, 'top-emojis').then(function() {
                store.commit('generationEnded');
              });
            });
          });
        });
    },
  },
};
</script>

<style scoped>
div {
  display: inline-block;
}
</style>
