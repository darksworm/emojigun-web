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

      return "https:" + this.urls[maxIdx];
    },
    isSelected() {
      return this.$store.getters.isEmojiSelectedByURL(this.largestUrl);
    }
  },
  methods: {
    getFile() {
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.largestUrl, true);
        xhr.responseType = "blob";

        let name = this.name + ".png";
        let largestUrl = this.largestUrl;

        xhr.onload = function() {
          resolve({
            name: name,
            url: largestUrl,
            blob: this.response
          });
        };

        xhr.send();
      });
    },
    selectThis() {
      this.getFile().then(f => {
        this.$store.commit("selectEmoji", f);
      });
    },
    deselectThis() {
      this.getFile().then(f => {
        this.$store.commit("deselectEmoji", f);
      });
    }
  }
};
</script>

<style scoped lang="scss">
img {
  width: 64px;
  height: 64px;
}
</style>
