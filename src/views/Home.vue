<template>
  <div id="home">
    <h1>EMOJI<span class="alt-color">GUN</span></h1>
    <h2>Free and open-source emoji sharing tool</h2>
    <button id="get-started-btn" :class="{ animated: buttonAnimation }">
      Get started
    </button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    setTimeout(function() {
        this.buttonAnimation = true;
    }.bind(this), 3500);
  },
  data() {
    return {
      buttonAnimation: false,
    };
  },
  components: {},
};
</script>

<style lang="scss" scoped>
@import '../styles/colors.scss';
#home {
  z-index: 0;
  width: 100%;
  text-align: center;

  .alt-color {
    color: $color-complementary-1;
  }

  h1 {
    font-size: 6.5vw;
    margin-block-start: 0.2em;
    margin-block-end: 0.2em;

    &:before {
      position: absolute;
      left: 0;
      top: 50%;
      content: '';
      background: radial-gradient(black, transparent);
    }
  }

  h2 {
    font-size: 1.5vw;
  }

  #get-started-btn {
    background: $color-complementary-3;
    color: $color-complementary-1;

    &:hover {
      background: lighten($color-complementary-3, 3%);
    }

    &.animated {
      animation: nudge 0.4s linear;
    }
  }

  button {
    padding: 20px 34px;
    text-transform: uppercase;
    font-size: 26px;
  }
}

@keyframes nudge {
  0% {
    transform: rotate(-3.5deg);
  }

  33% {
    transform: rotate(3.5deg);
  }

  66% {
    transform: rotate(-3.5deg);
  }
}
</style>
