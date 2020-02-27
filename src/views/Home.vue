<template>
  <div id="home">
    <div class="welcome scroll-block scroll-block-center" id="welcome">
      <div class="scroll-block-wrapper">
        <h1>EMOJI<span class="alt-color">GUN</span></h1>
        <h4>Sharing custom emojis made easy</h4>
        <button
          class="get-started-btn"
          :class="{animated: buttonAnimation}"
          @click="downloadForOS"
        >
          Download for {{ os }}
        </button>
        <router-link to="/loader"
          ><button id="get-emojis-btn">
            Get emojis
          </button>
        </router-link>
      </div>

      <template v-if="!bounceHidden">
        <div class="bounce-click-box" @click="scrollToMore"></div>
        <div class="bounce">
          <a class="arrow down" @click.prevent="scrollToMore"></a>
        </div>
      </template>
    </div>

    <div id="more" class="more scroll-block">
      <h2>The first custom emoji sharing tool.</h2>

      <div class="question-blocks">
        <div class="question-block">
          <h3>Where</h3>
          <p>
            Use EMOJIGUN to share or embed emojis in
            <b>any application</b> which supports images.
          </p>
        </div>

        <div class="question-block">
          <h3>Why</h3>
          <p>Use the same emoji library across all chat apps.</p>
          <p>
            Share custom emojis without having to import then in your chat app.
          </p>
          <p>
            Access your emojis with a few keypresses.
          </p>
        </div>

        <div class="question-block">
          <h3>What</h3>
          <p>
            You can share any images or emojis you want but to get started you
            should consider
            <router-link to="/loader">creating an emoji pack</router-link>
          </p>
        </div>
      </div>

      <!-- 
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
      -->

      <button class="get-started-btn" @click="scrollToTop">
        Get started
      </button>
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

    document
      .getElementById('home')
      .addEventListener('scroll', this.onScroll.bind(this));
  },
  data() {
    return {
      buttonAnimation: false,
      buttonClicked: false,
      bounceHidden: false,
    };
  },
  computed: {
    os() {
      let os = 'Unknown';

      if (window.navigator.userAgent.indexOf('Windows') !== -1) {
        os = 'Windows';
      }
      if (window.navigator.userAgent.indexOf('Mac') !== -1) {
        os = 'Mac';
      }
      if (window.navigator.userAgent.indexOf('X11') !== -1) {
        os = 'UNIX';
      }
      if (window.navigator.userAgent.indexOf('Linux') !== -1) {
        os = 'Linux';
      }

      return os;
    },
    osSupported() {
      return ['Windows', 'Linux'].indexOf(this.os) !== -1;
    },
  },
  destroyed() {
    document
      .getElementById('home')
      .removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll() {
      let homeScrollTop = document.getElementById('home').scrollTop;
      this.bounceHidden = homeScrollTop > 0;
    },
    scrollToMore(smooth = true) {
      this.scrollTo(window.innerHeight * 1, smooth);
    },
    scrollToTop() {
      this.scrollTo(0);
      this.buttonAnimation = false;
      setTimeout(() => (this.buttonAnimation = true), 1000);
    },
    scrollTo(height, smooth = true) {
      document.getElementById('home').scrollTo({
        top: height,
        left: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
      this.buttonClicked = true;
    },
    downloadForOS() {
      let url;
      this.buttonClicked = true;

      if (this.os === 'Linux') {
        url = 'https://github.com/darksworm/imgsel/blob/master/INSTALL.md';
      }

      if (this.os === 'Windows') {
        url =
          'https://github.com/darksworm/imgsel/releases/download/v0.2.0/imgsel.exe';
      }

      let win = window.open(url, '_blank');
      win.focus();
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
@import '../styles/colors.scss';
#home {
  z-index: 0;

  width: 100vw;
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

  #get-emojis-btn {
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
    margin-top: auto;
    margin-bottom: 48px;
  }

  a {
    color: $color-complementary-3;
  }

  .question-blocks {
    display: flex;
    flex-direction: row;
    justify-content: center;

    font-size: 20px;

    .question-block {
      max-width: 18vw;
      max-width: 440px;
      min-width: 360px;

      padding: 0 16px 16px;

      &:not(:last-child) {
        margin-right: 12px;
      }

      background: rgba(0, 0, 0, 0.7);
    }
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

.arrow {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: inline-block;

  &:before,
  &:after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 0.2rem;
    display: block;

    &:hover {
      background: red;
    }
  }

  &.left,
  &.right {
    width: 1.667em;
    &:before {
      top: 55%;
    }
    &:after {
      bottom: 55%;
    }
    &:before,
    &:after {
      left: -5%;
      height: 25%;
      width: 110%;
    }
  }

  &.up,
  &.down {
    height: 1.667em;
    &:before {
      left: 55%;
    }
    &:after {
      right: 55%;
    }
    &:before,
    &:after {
      top: -5%;
      height: 110%;
      width: 25%;
    }
  }

  &.left {
    &:before,
    &:after {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
  &.right {
    &:before,
    &:after {
      transform: rotate(-45deg);
    }
    &:after {
      transform: rotate(45deg);
    }
  }
  &.up {
    &:before,
    &:after {
      transform: rotate(-45deg);
    }
    &:after {
      transform: rotate(45deg);
    }
  }
  &.down {
    &:before,
    &:after {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
}

.bounce {
  position: absolute;
  top: calc(100vh - 48px);
  left: 50%;
  transform: translateX(-50%);

  -moz-animation: bounce 3s infinite;
  -webkit-animation: bounce 3s infinite;
  animation: bounce 3s infinite;

  &:hover {
    cursor: pointer;
  }
}

.bounce-click-box {
  position: absolute;
  top: calc(100vh - 104px);
  left: 0;
  width: 100vw;
  height: 104px;

  &:hover {
    cursor: pointer;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
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
