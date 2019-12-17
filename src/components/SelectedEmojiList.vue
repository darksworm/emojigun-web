<template>
  <emoji-list v-bind="$props" v-if="hasEmoji">
    <button>download</button>
  </emoji-list>
</template>

<script>
import EmojiList from "./EmojiList";

export default {
  name: "SelectedEmojiList",
  extends: EmojiList,
  data() {
    return { emoji: {} };
  },
  components: { EmojiList },
  computed: {
    hasEmoji() {
      return !!Object.keys(this.emoji).length;
    }
  },
  events: {
    selectedEmoji(emoji) {
      this.emoji[emoji.url] = emoji;
    },
    deselectedEmoji(emoji) {
      delete this.emoji[emoji.url];
    }
  }
};
</script>

<style scoped></style>
