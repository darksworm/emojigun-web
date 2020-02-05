<template>
  <div id="home">
    <div class="welcome scroll-block scroll-block-center">
      <div class="scroll-block-wrapper">
        <h1>EMOJI<span class="alt-color">GUN</span></h1>
        <h2>Free and open-source emoji sharing tool</h2>
        <button
          id="get-started-btn"
          :class="{animated: buttonAnimation}"
          @click="scrollToGetStarted"
        >
          Get started
        </button>
        <button id="more-btn" @click="scrollToMore">
          More
        </button>
      </div>
    </div>

    <div class="get-started scroll-block"></div>

    <div class="more scroll-block"></div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    setTimeout(
      function() {
        this.buttonAnimation = !this.buttonClicked;
      }.bind(this),
      3500,
    );
  },
  data() {
    return {
      buttonAnimation: false,
      buttonClicked: false,
    };
  },
  methods: {
    scrollToGetStarted() {
      this.scrollTo(window.innerHeight * 1);
    },
    scrollToMore() {
      this.scrollTo(window.innerHeight * 2);
    },
    scrollTo(height) {
      document.getElementById('home').scrollTo({
        top: height,
        left: 0,
        behavior: 'smooth',
      });
      this.buttonClicked = true;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
@import '../styles/colors.scss';
#home {
  z-index: 0;

  width: 100%;
  max-height: 100vh;

  text-align: center;
  overflow-y: scroll;
  overflow-x: hidden;

  scroll-snap-type: y mandatory;

  .alt-color {
    color: $color-complementary-1;
  }

  h1 {
    font-size: 6.5vw;
    margin: 0;
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

  #more-btn {
    margin-left: 16px;
  }

  button {
    padding: 20px 34px;
    text-transform: uppercase;
    font-size: 26px;
  }
}

.scroll-block {
  scroll-snap-align: start;

  height: 100vh;
  width: 100vw;

  &.welcome {
    background: red;
  }

  &.get-started {
    background: blue;
  }

  &.more {
    background: green;
  }

  &.scroll-block-center {
    display: flex;

    .scroll-block-wrapper {
      margin: auto;
    }
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
