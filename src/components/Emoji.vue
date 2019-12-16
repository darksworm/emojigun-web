<template>
  <div>
    <img :src="largestUrl" />
    <div>{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: "Emoji",
  props: {
    name: String,
    urls: {}
  },
  data() {
    return {
      selected: Boolean
    };
  },
  computed: {
    largestUrl() {
      let maxIdx = Object.keys(this.urls)
        .sort()
        .reverse()[0];

      return "https:" + this.urls[maxIdx];
    }
  },
  methods: {
    getFile() {
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", this.largestUrl, true);
        xhr.responseType = "blob";
        let name = this.name + ".png";

        xhr.onload = function() {
          resolve({
            name: name,
            blob: this.response
          });
        };

        // TODO
        // xhr.onerror =

        xhr.send();
      });
    },
    isSelected() {
      // TODO
      return true;
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
