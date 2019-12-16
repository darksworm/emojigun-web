<template>
  <div>
    <img :src="largestUrl"/>
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
  computed: {
    largestUrl() {
      let maxIdx = Object.keys(this.urls)
        .sort()
        .reverse()[0];

      return "https:" + this.urls[maxIdx];
    }
  },
  methods: {
    download() {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", this.largestUrl, true);
      xhr.responseType = "blob";
      let name = this.name;

      xhr.onload = function() {
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement("a");
        tag.href = imageUrl;
        tag.download = name + ".png";
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
      };

      xhr.send();
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
