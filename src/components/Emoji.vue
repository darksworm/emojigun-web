<template>
  <div>
    <img :src="largestUrl" />
    <div>{{ name }}</div>

    <button v-if="!isSelected" @click="selectThis">+</button>
    <button v-else @click="deselectThis">-</button>
  </div>
</template>

<script>
export default {
  name: 'Emoji',
  props: {
    name: String,
    urls: {},
  },
  computed: {
    largestUrl() {
      let maxIdx = Object.keys(this.urls)
        .sort()
        .reverse()[0];

      let url = this.urls[maxIdx];
      if (url.indexOf('https') === -1) {
        return 'https:' + url;
      }

      return url;
    },
    isSelected() {
      return this.$store.getters.isEmojiSelectedByURL(this.largestUrl);
    },
  },
  methods: {
    getEmoji() {
      let urlTextAfterLastDot = this.largestUrl.split('.').slice(-1);
      let filename = this.name;
      if (urlTextAfterLastDot !== this.largestUrl) {
        filename += '.' + urlTextAfterLastDot;
      }

      return {
        name: this.name,
        filename: filename,
        url: this.largestUrl,
      };
    },
    getFile() {
      return new Promise(resolve => {
        let emoji = this.getEmoji();

        let xhr = new XMLHttpRequest();
        xhr.open('GET', emoji.url, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
          emoji.blob = this.response;
          resolve(emoji);
        };

        xhr.send();
      });
    },
    selectThis() {
      this.$store.commit('selectEmoji', this.getEmoji());
    },
    deselectThis() {
      this.$store.commit('deselectEmoji', this.getEmoji());
    },
  },
};
</script>

<style scoped lang="scss">
img {
  width: 64px;
  height: 64px;
}
</style>
