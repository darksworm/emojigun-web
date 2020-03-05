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
        <router-link
          to="/loader"
          @click="$ga.event('buttons', 'get-emojis')"
          style="text-decoration: none"
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
            Share custom emojis without having to import them in your chat app.
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

      <div class="bottom-btns">
        <button class="bottom-get-started-btn" @click="scrollToTop">
          Get started
        </button>

        <button class="see-in-action-btn" @click="showGallery">
          See it in action
        </button>
      </div>
    </div>

    <vue-gallery
      :images="images"
      :index="galleryIndex"
      :options="{
        onslideend: onGalleryImg,
        carousel: false,
        continuous: false,
      }"
      @close="closeGallery"
    ></vue-gallery>
  </div>
</template>

<script>
import VueGallery from 'vue-gallery';
import {event} from 'vue-analytics';

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

    this.$store.commit('slideRightForNextTransition');
  },
  data() {
    return {
      buttonAnimation: false,
      buttonClicked: false,
      bounceHidden: false,
      bottomVisitedOnce: false,
      galleryOpen: false,
      galleryOpenedOnce: false,
      images: [
        require('../../assets/search-by-typing.gif'),
        require('../../assets/navigate-with-arrow-keys.gif'),
        require('../../assets/advanced-navigation.gif'),
        require('../../assets/its-fast.gif'),
      ],
      galleryIndex: null,
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
    closeGallery() {
      this.galleryOpen = false;
      this.galleryIndex = null;
      document.getElementById('home').style.overflowY = 'scroll';
    },
    showGallery() {
      this.galleryIndex = 1;
      this.galleryOpenedOnce = true;
      this.galleryOpen = true;

      document.getElementById('home').style.overflowY = 'hidden';

      event('buttons', 'see-it-in-action');
    },
    onScroll() {
      let homeScrollTop = document.getElementById('home').scrollTop;
      this.bounceHidden = homeScrollTop > 0;

      if (homeScrollTop >= window.innerHeight - 1) {
        this.bottomVisitedOnce = true;
      }
    },
    scrollToMore(smooth = true) {
      this.scrollTo(window.innerHeight * 1, smooth);

      event('buttons', 'scroll-to-more');
    },
    scrollToTop() {
      this.scrollTo(0);
      this.buttonAnimation = false;
      setTimeout(() => (this.buttonAnimation = true), 1000);

      event('buttons', 'scroll-to-more');
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

      event('buttons', 'download', this.os);

      let win = window.open(url, '_blank');
      win.focus();
    },
    onGalleryImg() {
      if (this.galleryOpen) {
        event('gallery', 'switch-image');
      }
    },
  },
  components: {VueGallery},
  watch: {
    bottomVisitedOnce() {
      event('view', 'more');
    },
  },
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

  @media only screen and (min-width: 1920px) {
    scroll-snap-type: y mandatory;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;

  .alt-color {
    color: $color-complementary-1;
  }

  h1 {
    margin: 0;
    font-size: 12rem;

    @media screen and (max-width: 760px) {
      font-size: 10rem;
    }
    @media screen and (max-width: 640px) {
      font-size: 8rem;
    }
  }

  h2 {
    font-size: 5.5rem;

    @media screen and (max-width: 540px) {
      font-size: 4.5rem;
    }
  }

  h4 {
    font-size: 3rem;
    margin-top: 0;

    @media screen and (max-width: 640px) {
      font-size: 2.5rem;
    }
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

    @media screen and (max-width: 600px) {
      width: 360px;
      display: block;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 1.5rem;
    }
  }

  #get-emojis-btn {
    margin-left: 16px;

    @media screen and (max-width: 600px) {
      width: 360px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

  button {
    padding: 20px 34px;
    text-transform: uppercase;
    font-size: 2.2rem;
  }
}

.scroll-block {
  scroll-snap-align: start;

  @media only screen and (min-width: 1920px) {
    height: 100vh;
  }
  @media only screen and (max-width: 1920px) {
    min-height: 100vh;
  }

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
    @media screen and (min-width: 1024px) {
      padding-top: 6vh;
    }
  }

  display: flex;
  flex-direction: column;

  .bottom-btns {
    align-self: center;
    flex-direction: row;

    display: flex;

    .bottom-get-started-btn {
      background: $color-complementary-3;
      color: $color-complementary-1;
      margin-left: auto;
      margin-right: 16px;
    }
    .see-in-action-btn {
      margin-right: auto;
    }

    @media only screen and (min-width: 1920px) {
      margin-top: auto;
      margin-bottom: 12vh;
    }

    @media only screen and (max-width: 1920px) {
      margin-top: 2.5rem;
      margin-bottom: 3.5rem;
    }
    @media only screen and (max-width: 540px) {
      flex-direction: column;
      button {
        min-width: 392px;
        width: 66vw;
      }

      .bottom-get-started-btn,
      .see-it-in-action-btn {
        margin: 0;
      }

      .bottom-get-started-btn {
        margin-bottom: 1.5rem;
      }
    }
  }

  a {
    color: $color-complementary-3;
  }

  .question-blocks {
    display: flex;
    flex-direction: row;
    justify-content: center;

    font-size: 1.4rem;

    .question-block {
      min-width: 360px;
      max-width: 540px;

      padding: 0 16px 16px;

      &:not(:last-child) {
        margin-right: 12px;
      }

      @media only screen and (max-width: 800px) {
        font-size: 2rem;
      }

      background: rgba(0, 0, 0, 0.7);
    }

    @media only screen and (max-width: 1500px) {
      flex-direction: column;

      .question-block {
        width: calc(66vw - 32px);

        &:not(:last-child) {
          margin-right: auto;
        }

        margin-left: auto;
        margin-right: auto;

        &:not(:first-child) {
          margin-top: 2rem;
        }
      }
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
    width: 1.667rem;
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
    height: 1.667rem;
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
