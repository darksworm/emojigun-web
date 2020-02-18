<template>
  <div id="home">
    <div class="welcome scroll-block scroll-block-center" id="welcome">
      <div class="scroll-block-wrapper">
        <h1>EMOJI<span class="alt-color">GUN</span></h1>
        <h4>Sharing custom emojis made easy</h4>
        <button
          class="get-started-btn"
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

    <div class="more scroll-block">
      <h2>The first custom emoji sharing tool.</h2>

      <p>
        Bored of built-in chat app emojis?
      </p>
      <p>
        Want a consistent emoji sharing experience across all chat apps?
      </p>
      <p>
        Want to easily share your own custom emojis?
      </p>

      With emojigun you can share your emojis with ease. You can either add your
      own emojis or create a pack using our
      <router-link to="/loader">emojiloader</router-link>.

      <div>
        It is also
        <ul>
          <li>
            free and open-source
          </li>
          <li>
            available on windows and linux
          </li>
          <li>
            compatible with any app which supports pasting images
          </li>
        </ul>
      </div>

      <button class="get-started-btn" @click="scrollToGetStarted">
        Get started
      </button>
    </div>

    <div id="get-started" class="get-started scroll-block">
      <router-link to="/loader">
        Get emojis
        <img :src="require('../../public/sunglasses.svg')" />
      </router-link>

      <a
        class="download download-linux"
        href="https://github.com/darksworm/imgsel/blob/master/INSTALL.md"
      >
        Download for Linux
        <img :src="require('../../public/tux_mono.svg')" />
      </a>
      <a
        class="download download-windows"
        href="https://github.com/darksworm/imgsel/releases/download/v0.2.0/imgsel.exe"
      >
        Download for Windows
        <img :src="require('../../public/windows.svg')" />
      </a>
    </div>
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
      this.scrollTo(window.innerHeight * 2);
    },
    scrollToMore() {
      this.scrollTo(window.innerHeight * 1);
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
    font-size: 3.5vw;
  }

  h4 {
    font-size: 1.5vw;
  }

  .get-started-btn {
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

  &.scroll-block-center {
    display: flex;

    .scroll-block-wrapper {
      margin: auto;
    }
  }
}

.more {
  h2 {
    padding-top: 6vh;
  }

  display: flex;
  flex-direction: column;

  .get-started-btn {
    align-self: center;
  }
}

#get-started {
  display: flex;
  list-style: none;

  a,
  router-link {
    width: 20vw;
    height: 20vw;
    border-radius: 1.5vw;

    margin: auto 0 auto 4vw;

    &:first-child {
      margin-left: auto;
    }

    &:last-child {
      margin-right: auto;
    }

    img {
      width: 50%;
      height: 50%;
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
