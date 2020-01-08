<template>
  <div id="app" :class="bgClass">
    <div class="appBg2"></div>
    <router-view />
    <selected-emoji-list></selected-emoji-list>
  </div>
</template>

<style lang="scss">
@import 'styles/global';
@import '../public/bttn.min.css';

#app {
  width: 100%;
  height: 100%;
  color: $color-light;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  &:before {
    position: absolute;

    width: 100%;
    height: 100%;

    content: '';
  }

  @for $i from 1 through 6 {
    &.bg#{$i}:before {
      background-image: url('../public/background#{$i}.png');
      background-position: -24px -24px;
      filter: blur(3px);
    }
  }
}

.appBg2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255, 0.2);
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
import SelectedEmojiList from './components/SelectedEmojiList';
export default {
  components: {SelectedEmojiList},
  data() {
    return {};
  },
  computed: {
    bgClass() {
      let bg = Math.round(Math.random() * 5) + 1;
      return 'bg' + bg;
    },
  },
  mounted() {},
};
</script>
