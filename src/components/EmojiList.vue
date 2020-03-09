<template>
  <div v-if="haveEmojis">
    <h2 class="title">{{ title }}</h2>
    <template v-for="(emoji, i) in emojis">
      <div class="emojiContainer" v-bind:key="i">
        <emoji :name="emoji.name" :urls="emoji.urls || [emoji.url]"></emoji>
      </div>
    </template>
    <slot></slot>
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
  computed: {
    haveEmojis() {
      return this.emojis && Object.keys(this.emojis).length > 0;
    }
  },
  props: {
    title: String,
    emojiList: Array
  },
  mounted() {
    this.emojis = this.emojiList;
    this.loadEmojis().then(e => (this.emojis = e));
  },
  methods: {
    loadEmojis() {
      return Promise.resolve();
    },
    getFiles() {
      return Promise.all(this.$children.map(x => x.getFile()));
    },
    isSelected() {
      return !!this.$children.reduce((acc, x) => acc + x.isSelected(), false);
    }
  },
  watch: {
    emojiList(val) {
      this.emojis = val;
    }
  }
};
</script>

<style scoped>
.emojiContainer {
  display: inline-block;
  font-size: 16px;
}
</style>
