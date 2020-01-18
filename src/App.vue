<template>
  <div id="app" :class="bgClass">
    <div id="appShadow"></div>
    <router-view />
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
    position: fixed;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    content: '';

    background-image: url('../public/background-multi.jpg');
    background-position: -24px -24px;
    background-repeat: repeat;

    filter: blur(3px);
  }
}

#appShadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(90, 45, 0, 0.35);

  &.dark {
    background: rgba(0, 0, 0, 0.65);
  }
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
export default {
  components: {},
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
