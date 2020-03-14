<template>
  <div id="home" :class="{'scroll-snap-disabled': snapDisabled}">
    <div class="welcome scroll-block scroll-block-center" id="welcome">
      <div class="scroll-block-wrapper">
        <h1>EMOJI<span class="alt-color">GUN</span></h1>
        <h4>Sharing custom emojis made easy</h4>
        <button
          class="get-started-btn"
          :class="{animated: buttonAnimation}"
          @click="downloadForOS"
        >
          <span v-if="osSupported">Download for {{ os }}</span>
          <span v-else>Learn more</span>
        </button>
        <router-link
          to="/loader"
          @click="event('buttons', 'get-emojis')"
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
        <div class="question-block where">
          <h3>Where</h3>
          <p>
            Use EMOJIGUN to share or embed emojis in
            <b>any application or website</b> which supports images.
          </p>
          <p>
            EMOJIGUN is currently available for Windows and Linux.
          </p>
        </div>

        <div class="question-block why">
          <h3>Why</h3>
          <p>Use the same emoji library across all chat apps.</p>
          <p class="mobile-disappear">
            Share custom emojis without having to import them in your chat app.
          </p>
          <p>
            Access your emojis with a few keypresses.
          </p>
        </div>

        <div class="question-block what">
          <template v-if="!showSubscribe">
            <h3>What</h3>
            <p>
              You can share any images or emojis you want but to get started you
              should consider
              <router-link to="/loader">creating an emoji pack</router-link>
            </p>
            <p>
              Want to learn more?
              <a href="#" @click="showSubscribe = true"
                >Subscribe to our newsletter</a
              >
            </p>
          </template>
          <template v-else>
            <div id="subscribe">
              <template v-if="subscribing">
                <Loader class="margin-auto"></Loader>
              </template>
              <template v-else-if="subscribed">
                <span>Thank you for subscribing!</span>
              </template>
              <template v-else-if="subscribeFail">
                <div>
                  Something went wrong. Please try again later.
                </div>
              </template>
              <template v-else>
                <label for="subscribe-input" v-if="!invalidEmail"
                  >Please enter your email address:</label
                >
                <label for="subscribe-input" v-else
                  >Please enter a <b>valid</b> email address:</label
                >
                <input
                  id="subscribe-input"
                  type="email"
                  v-model="email"
                  :class="{invalid: invalidEmail}"
                />
                <button class="subscribe-btn" @click="subscribeToNewsletter">
                  Subscribe
                </button>
              </template>
            </div>
          </template>
        </div>

        <div class="question-block features">
          <p>
            To request features or to report bugs please create an issue in the
            <a
              href="https://github.com/darksworm/emojigun/issues"
              target="_blank"
              >github repository</a
            >.
          </p>
          <p>
            Release notes can be found in the
            <a
              href="https://github.com/darksworm/emojigun/releases"
              target="_blank"
              >github repository</a
            >.
          </p>
        </div>

        <div class="question-block hobby">
          <p>
            EMOJIGUN is a hobby project which was created after Discord removed
            the freedom of custom global emotes.
          </p>
          <p>
            This project is maintained by
            <a href="https://github.com/darksworm" target="_blank">darksworm</a>
            in their free time.
          </p>
        </div>

        <div class="question-block oss">
          <p>
            EMOJIGUN and this website are <b>Open-source software</b> and are
            licensed under the
            <a
              href="https://github.com/darksworm/emojigun/blob/master/LICENSE.txt"
              target="_blank"
              >MIT license</a
            >.
          </p>

          <p>
            You can find the source code and contribute
            <a href="https://github.com/darksworm/emojigun" target="_blank"
              >here</a
            >
            and
            <a href="https://github.com/darksworm/emojigun-web" target="_blank"
              >here</a
            >.
          </p>
        </div>
      </div>

      <div class="bottom-btns">
        <button
          class="bottom-get-started-btn"
          @click="scrollToTop"
          v-if="osSupported"
        >
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

    <div class="mdc-snackbar">
      <div class="mdc-snackbar__surface">
        <div class="mdc-snackbar__label" role="status" aria-live="polite">
          Sorry, EMOJIGUN is currently available only on Windows and Linux but
          your interest has been noted.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueGallery from 'vue-gallery';
import Loader from '../components/Loader';
import {event} from 'vue-analytics';
import {MDCSnackbar} from '@material/snackbar';
import '@material/snackbar/dist/mdc.snackbar.min.css';

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
        require('../../assets/its-fast.gif'),
        require('../../assets/search-by-typing.gif'),
        require('../../assets/navigate-with-arrow-keys.gif'),
        require('../../assets/advanced-navigation.gif'),
      ],
      galleryIndex: null,
      snapDisabled: false,
      previousScrollTop: 0,
      showSubscribe: false,
      subscribed: false,
      subscribeFail: false,
      invalidEmail: false,
      subscribing: false,
      email: '',
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
      if (
        window.navigator.userAgent.indexOf('Linux') !== -1 ||
        window.navigator.userAgent.indexOf('X11') !== -1
      ) {
        os = 'Linux';
      }

      return os;
    },
    osSupported() {
      return ['Windows', 'Linux', 'Mac'].indexOf(this.os) !== -1;
    },
  },
  destroyed() {
    document
      .getElementById('home')
      .removeEventListener('scroll', this.onScroll);
  },
  methods: {
    validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    subscribeToNewsletter() {
      event('buttons', 'subscribe-to-newsletter');

      if (!this.validateEmail(this.email)) {
        this.invalidEmail = true;
        return;
      }

      this.invalidEmail = false;
      this.subscribing = true;

      this.$http
        .put(
          'https://qrcw8j8y2f.execute-api.eu-west-1.amazonaws.com/default/putEmojigunEmailInDynamo',
          {
            Email: this.email,
          },
        )
        .then(response => {
          if (response.body.success) {
            this.subscribed = true;
          } else {
            this.subscribeFail = true;
          }

          this.subscribing = false;
        })
        .catch(() => {
          this.subscribeFail = true;
          this.subscribing = false;
        });
    },
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
        this.snapDisabled = this.previousScrollTop < homeScrollTop;
      } else {
        this.snapDisabled = false;
      }

      this.previousScrollTop = homeScrollTop;
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
      let url = '';
      this.buttonClicked = true;

      if (this.os === 'Linux') {
        url = 'https://github.com/darksworm/imgsel/blob/master/INSTALL.md';
      }

      if (this.os === 'Windows') {
        url =
          'https://github.com/darksworm/imgsel/releases/download/v0.2.0/imgsel.exe';
      }

      event('buttons', 'download', this.os);

      if (this.os === 'Mac') {
        let snack = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        snack.open();
      } else if (!this.osSupported) {
        this.scrollToMore();
        return;
      }

      if (url != '') {
        let win = window.open(url, '_blank');
        win.focus();
      }
    },
    onGalleryImg() {
      if (this.galleryOpen) {
        event('gallery', 'switch-image');
      }
    },
    resetSubscribe() {
      this.email = '';
      this.subscribeFail = false;
      this.subscribed = false;
      this.showSubscribe = false;
    },
  },
  components: {VueGallery, Loader},
  watch: {
    bottomVisitedOnce() {
      event('view', 'more');
    },
    subscribed(val) {
      if (val) {
        setTimeout(this.resetSubscribe, 5000);
      }
    },
    subscribeFail(val) {
      if (val) {
        setTimeout(this.resetSubscribe, 5000);
      }
    },
  },
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

  &:not(.scroll-snap-disabled) {
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
    @media screen and (max-width: 375px) {
      font-size: 7.5rem;
    }
  }

  h2 {
    font-size: 5.5rem;

    @media screen and (max-width: 540px) {
      font-size: 4.5rem;
    }
    @media screen and (max-width: 375px) {
      font-size: 4rem;
    }
  }

  h4 {
    font-size: 3rem;
    margin-top: 0;

    @media screen and (max-width: 640px) {
      font-size: 2.5rem;
    }

    @media screen and (max-width: 375px) {
      font-size: 2rem;
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

    @media screen and (max-width: 400px) {
      width: 80vw;
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

    @media screen and (max-width: 400px) {
      width: 80vw;
    }
  }

  button {
    padding: 20px 34px;
    text-transform: uppercase;
    font-size: 2.2rem;

    @media screen and (max-width: 860px) {
      padding: 16px 26px;
    }
  }
}

.scroll-block {
  scroll-snap-align: start;

  @media only screen and (min-width: 1921px) {
    min-height: 100vh;
  }
  @media only screen and (max-width: 1920px) {
    min-height: 100vh;
  }

  width: 100%;

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
    margin-top: 2.5rem;
    margin-bottom: 3.5rem;

    display: flex;

    @media only screen and (min-width: 541px) {
      button {
        margin-top: 2rem;
      }
    }

    .bottom-get-started-btn {
      background: $color-complementary-3;
      color: $color-complementary-1;
      margin-left: auto;
      margin-right: 16px;
    }
    .see-in-action-btn {
      margin-right: auto;
    }

    @media only screen and (min-width: 1201px) {
      margin-top: auto;
      margin-bottom: 4rem;
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

    @media only screen and (max-width: 540px) {
      button {
        min-width: unset;
        width: 80vw;
      }
    }
  }

  a {
    color: $color-complementary-3;
  }

  .question-blocks {
    font-size: 1.4rem;
    justify-content: center;

    display: grid;
    grid-template-columns: 36rem 36rem 36rem;
    grid-template-rows: 18rem 14rem;
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;

    .question-block {
      height: calc(100% - 1rem);
      width: calc(100% - 2rem);

      padding: 0 1rem 1rem;

      &.oss,
      &.hobby,
      &.features {
        height: calc(100% - 2rem);
        padding: 1rem;
        display: flex;
        flex-direction: column;

        @media only screen and (min-width: 601px) {
          p {
            margin-bottom: 0;

            &:first-child {
              margin-top: auto;
            }

            &:last-child {
              margin-bottom: auto;
            }
          }
        }
      }

      background: rgba(0, 0, 0, 0.7);

      @media only screen and (max-width: 400px) {
        min-width: unset;
        max-width: unset;
        width: calc(95vw - 32px);
      }
    }

    @media only screen and (max-width: 1500px) {
      grid-template-columns: 30% 30% 30%;
      grid-template-rows: 18rem 14rem;
    }

    @media only screen and (max-width: 1300px) and (min-width: 601px) {
      grid-template-columns: 45% 45%;
      grid-template-rows: 19rem 19rem 19rem;

      .question-block {
        &.where {
          grid-row-start: 1;
        }

        &.features {
          grid-row: 1;
          grid-column: 2;
        }

        &.why {
          grid-row-start: 2;
        }

        &.hobby {
          grid-row: 2;
          grid-column: 2;
        }

        &.what {
          grid-row-start: 3;
        }

        &.oss {
          grid-row: 3;
          grid-column: 2;
        }
      }
    }

    @media only screen and (max-width: 720px) {
      font-size: 1.5rem;
      grid-template-rows: 22rem 22rem 22rem;

      .mobile-disappear {
        display: none;
      }
    }

    @media only screen and (max-width: 600px) {
      font-size: 2rem;

      grid-template-columns: 90%;
      grid-template-rows: auto;

      .question-block {
        &.where {
          grid-row: 1;
        }

        &.features {
          grid-row: 2;
        }

        &.why {
          grid-row: 3;
        }

        &.hobby {
          grid-row: 4;
        }

        &.what {
          grid-row: 5;
        }

        &.oss {
          grid-row: 6;
        }

        h3 {
          margin-top: 1rem;
          margin-bottom: 0;
        }

        p {
          margin-bottom: 2rem;

          &:first-of-type {
            margin-top: 2rem;
          }
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

@media only screen and (max-height: 560px) {
  .bounce-click-box {
    height: 60px;
    top: calc(100% - 60px);
  }
}

@media only screen and (max-height: 440px) {
  .bounce-click-box,
  .bounce {
    display: none;
  }
}

.mdc-snackbar__label {
  font-size: 16px;
}

button {
  border-radius: 8px;
}

.mdc-snackbar:not(.mdc-snackbar--open) {
  display: none;
}

.modal {
  display: none;
}

.modal.is-open {
  display: block;
}

#subscribe {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  *:first-child {
    margin-top: auto;
  }

  *:last-child {
    margin-bottom: auto;
  }

  #subscribe-input {
    width: calc(100% - 32px);
    max-width: 240px;

    margin: 10px auto;
    padding: 6px 3px;

    border-radius: 6px;

    &.invalid {
      border: 2px solid red;
    }
  }

  button {
    font-size: 1.5rem;
    padding: 9px 16px;
    margin: 0 auto;
  }
}

.margin-auto {
  margin: auto;
}
</style>
