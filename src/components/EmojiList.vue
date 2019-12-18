<template>
  <div v-if="haveEmojis">
    <h2 class="title">{{ title }}</h2>
    <template v-for="(emoji, i) in emojis">
      <div class="emoji" v-bind:key="i">
        <emoji :name="emoji.name" :urls="emoji.urls"></emoji>
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
    title: String
  },
  mounted() {
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
  }
};
</script>

<style scoped>
.emoji {
  display: inline-block;
}
</style>
