<template>
  <emoji-list v-bind="$props">
    <button>download</button>
  </emoji-list>
</template>

<script>
import EmojiList from "./EmojiList";

export default {
  name: "SelectedEmojiList",
  extends: EmojiList,
  components: { EmojiList },
  computed: {
    emojis() {
      return this.$store.state.selectedEmojis;
    }
  }
};
</script>

<style scoped></style>
