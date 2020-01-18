<template>
  <div id="home">
    <button
      class="top-emoji-pack bttn-slant bttn-lg bttn-success bttn-primary"
      @click="downloadTopEmojis()"
    >
      Download top emoji pack
    </button>

    <router-link to="custom" class="custom-pack">
      <button class="custom-emoji-pack bttn-slant bttn-lg bttn-secondary">
        Create custom emoji pack
      </button>
    </router-link>
  </div>
</template>

<script>
import Emoji from '../components/Emoji';
import Vue from 'vue';
import downloadZipOfFiles from '../mixins/downloader';

export default {
  name: 'Home',
  components: {},
  mounted() {},
  methods: {
    downloadTopEmojis() {
      let files = [];
      let promises = {};
      let emotePromises = [];

      for (let page = 1; page <= 3; page++) {
        let ffzPromise = this.$http
          .get(
            'https://api.frankerfacez.com/v1/emoticons?sort=count&per_page=200&page=' +
              page,
          )
          .then(function(response) {
            this.emojiList = response.body.emoticons.map(x => {
              let promise = this.getEmojiFile(x.name, x.urls).then(function(
                file,
              ) {
                if (file.blob instanceof Blob) {
                  files.push(file);
                }
              });

              emotePromises.push(promise);
            });
          })
          .catch(() => {
            this.$emit('not-found', this.channelName);
          });

        promises['ffz' + page] = ffzPromise;
      }

      this.$http
        .get(
          'https://api.streamelements.com/kappa/v2/chatstats/global/stats?limit=100',
        )
        .then(function(resp) {
          for (let emote of resp.body.ffzEmotes) {
            let promise = this.$http
              .get('https://api.frankerfacez.com/v1/emote/' + emote.id)
              .then(
                function(loadedEmote) {
                  let promise = this.getEmojiFile(
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

          Promise.all(Object.values(promises)).then(function() {
            Promise.all(emotePromises).then(function() {
              downloadZipOfFiles(files, 'top-emojis');
            });
          });
        });
    },
    getEmojiFile(name, urls) {
      let EmojiComponentClass = Vue.extend(Emoji);
      let emojiComponent = new EmojiComponentClass({
        propsData: {
          name: name,
          urls: urls,
        },
      });

      return emojiComponent.getFile();
    },
  },
};
</script>

<style lang="scss">
@import '../styles/colors.scss';

#home {
  width: 100%;
  text-align: center;

  .custom-emoji-pack {
    margin-left: 24px;
  }

  button {
    padding: 16px 30px;
  }
}
</style>
