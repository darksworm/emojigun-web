<template>
  <div id="app" :class="bgClass">
    <div id="appShadow"></div>

    <transition :name="transitionName" v-if="transitionName">
      <router-view />
    </transition>
    <router-view v-else />

    <div id="generatingOverlay" v-if="isGeneratingZip">
      <div>
        <div class="text">Generating zip</div>
        <Loader></Loader>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from './components/Loader';

export default {
  components: {Loader},
  data() {
    return {transitionName: 'slideout'};
  },
  computed: {
    bgClass() {
      let bg = Math.round(Math.random() * 5) + 1;
      return 'bg' + bg;
    },
    isGeneratingZip() {
      return this.$store.state.generatingZip;
    },
  },
  mounted() {},
  watch: {
    $route(to, from) {
      if (from.name === 'loader' && to.name === 'home') {
        this.transitionName = 'slide-left';
      } else if (from.name === 'home' && to.name === 'loader') {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = '';
      }
    },
  },
};
</script>

<style lang="scss">
@import 'styles/global';

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

  background: rgba(15, 0, 0, 0.45);

  &.dark {
    background: rgba(15, 0, 0, 0.65);
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

#generatingOverlay {
  position: fixed;
  width: 100%;
  height: 100%;

  font-size: 36px;
  font-weight: bold;

  &:before {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';
    background: rgba(darken($color-complementary-1, 80%), 0.8);
  }

  > div {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 28px;
  }

  .text {
    margin-bottom: 12px;
  }
}

.slide-left-leave-active,
.slide-left-enter-active,
.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.8s;
  position: absolute;

  &,
  * {
    overflow: hidden !important;
  }
}
.slide-right-enter {
  transform: translate(100%, 0);
}
.slide-right-leave-to {
  transform: translate(-100%, 0);
}

.slide-left-enter {
  transform: translate(-100%, 0);
}
.slide-left-leave-to {
  transform: translate(100%, 0);
}
</style>
