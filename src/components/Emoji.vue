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
  computed: {
    largestUrl() {
      let maxIdx = Object.keys(this.urls)
        .sort()
        .reverse()[0];

      return this.urls[maxIdx];
    }
  },
  methods: {
    download() {
      // TODO: this doesn't work due to CORS
      var xhr = new XMLHttpRequest();
      xhr.open("GET", this.largestUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement("a");
        tag.href = imageUrl;
        tag.download = this.name + ".png";
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
