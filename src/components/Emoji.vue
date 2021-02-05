<template>
  <div class="emoji" :class="{ selected: isSelected }">
    <div>
      <img :src="largestUrl" />
      <div class="title">{{ name }}</div>

      <button v-if="!isSelected" @click="selectThis">+</button>
      <button v-else @click="deselectThis">-</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Emoji",
  props: {
    name: String,
    urls: {}
  },
  computed: {
    largestUrl() {
      let maxIdx = Object.keys(this.urls)
        .sort()
        .reverse()[0];

      let url = this.urls[maxIdx];
      if (url.indexOf("https") === -1) {
        return "https:" + url;
      }

      return url;
    },
    isSelected() {
      return this.$store.getters.isEmojiSelectedByURL(this.largestUrl);
    }
  },
  methods: {
    getEmoji() {
      return {
        name: this.name,
        url: this.largestUrl
      };
    },
    getFile() {
      return new Promise(resolve => {
        let emoji = this.getEmoji();

        let xhr = new XMLHttpRequest();
        xhr.open("GET", emoji.url, true);
        xhr.responseType = "blob";

        xhr.onload = function() {
          emoji.blob = this.response;
          let fileExtension = emoji.blob.type.split('/').pop();
          emoji.filename = emoji.name + '.' + fileExtension;
          resolve(emoji);
        };

        xhr.send();
      });
    },
    selectThis() {
      this.$store.commit("selectEmoji", this.getEmoji());
    },
    deselectThis() {
      this.$store.commit("deselectEmoji", this.getEmoji());
    }
  }
};
</script>

<style scoped lang="scss">
img {
  max-width: 64px;
  max-height: 64px;
}
</style>
