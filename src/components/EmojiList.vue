<template>
  <div>
    <h2 class="title">{{ title }}</h2>
    <emoji
      v-for="(emoji, i) in emojis"
      v-bind:key="i"
      :name="emoji.name"
      :urls="emoji.urls"
    ></emoji>
  </div>
</template>

<script>
import Emoji from "./Emoji";

export default {
  name: "EmojiList",
  components: { Emoji },
  data: () => {
    return {
      emojis: {}
    };
  },
  props: {
    title: String
  },
  mounted() {
    this.loadEmojis().then(e => (this.emojis = e));
  },
  methods: {
    loadEmojis() {},
    download() {
      this.$children.forEach(x => x.download());
    }
  }
};
</script>

<style scoped></style>
