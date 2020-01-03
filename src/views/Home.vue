<template>
  <div id="home">
    <button class="top-emoji-pack" @click="downloadTopEmojis()">
      Download top 100 emoji pack
    </button>
    <router-link to="custom" class="custom-pack">
      <button class="custom-emoji-pack">
        Create custom emoji pack
      </button>
    </router-link>
  </div>
</template>

<script>
import Emoji from '../components/Emoji';
import Vue from 'vue';
import JSZip from "jszip";

export default {
  name: 'Home',
  components: {},
  mounted() {},
  methods: {
    downloadTopEmojis() {
      this.$http
        .get(
          'https://api.streamelements.com/kappa/v2/chatstats/global/stats?limit=100',
        )
        .then(function(resp) {
          let files = [];
          let promises = [];
          let emotePromises = [];

          for (let emote of resp.body.ffzEmotes) {
            if (emote.id == 326664) {
              continue;
            }

            let promise = this.$http
              .get('https://api.frankerfacez.com/v1/emote/' + emote.id)
              .then(function(loadedEmote) {
                let EmojiComponentClass = Vue.extend(Emoji);
                let emojiComponent = new EmojiComponentClass({
                  propsData: {
                    name: loadedEmote.body.emote.name,
                    urls: loadedEmote.body.emote.urls,
                  },
                });

                let emotePromise = emojiComponent
                  .getFile()
                  .then(function(file) {
                    files.push(file);
                  });
                emotePromises.push(emotePromise);
              });

            promises.push(promise);
          }

          Promise.all(promises).then(function() {
            Promise.all(emotePromises).then(function() {
              let zip = new JSZip();
              files.flat().map(file => zip.file(file.name, file.blob));

              zip.generateAsync({type: 'blob'}).then(
                blob => {
                  let tag = document.createElement('a');
                  let urlCreator = window.URL || window.webkitURL;

                  tag.href = urlCreator.createObjectURL(blob);
                  tag.download = 'emojis.zip';

                  document.body.appendChild(tag);
                  tag.click();
                  document.body.removeChild(tag);
                },
                function(err) {
                  console.log(err);
                },
              );
            });
          });
        });
    },
  },
};
</script>

<style lang="scss">
@import '../styles/colors.scss';

#home {
  width: 100%;
  text-align: center;
}
</style>
