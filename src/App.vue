<template>
  <div id="app">
    <router-view />
    <selected-emoji-list></selected-emoji-list>
  </div>
</template>

<style lang="scss">
@import "styles/global";

#app {
  width: 100%;
  height: 100%;
  background: transparent;
  color: $color-light;

  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import SelectedEmojiList from "./components/SelectedEmojiList";
export default {
  components: { SelectedEmojiList },
  data() {
    return {};
  },
  mounted() {}
};
</script>
