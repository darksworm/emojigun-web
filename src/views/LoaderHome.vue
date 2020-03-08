<template>
  <div id="loader-home">
    <div class="center-content">
      <h1>EMOJI<span class="alt-color">LOADER</span></h1>
      <DownloadTopEmojisButton>
        <button class="top-emoji-pack">
          Get top emoji pack
        </button>
      </DownloadTopEmojisButton>

      <button class="custom-emoji-pack custom-pack" @click="openCustom">
        Make custom emoji pack
      </button>
    </div>

    <router-link
      to="/"
      class="back"
      @click="$ga.event('buttons', 'back-to-emojigun')"
    >
      <h3>
        &lt; Back to EMOJIGUN
      </h3>
    </router-link>
  </div>
</template>

<script>
import DownloadTopEmojisButton from '../components/DownloadTopEmojisButton';

export default {
  name: 'LoaderHome',
  mounted() {
    this.$store.commit('slideLeftForNextTransition');
  },
  components: {DownloadTopEmojisButton},
  methods: {
    openCustom() {
      document.getElementById('loader-home').style.opacity = 0;

      this.$store.commit('skipNextTransition');
      this.$router.push('/custom');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors.scss';
#loader-home {
  z-index: 0;
  width: 100%;
  height: 100vh;
  text-align: center;

  display: flex;
  align-content: center;

  .center-content {
    margin: auto;
  }

  .alt-color {
    color: $color-complementary-1;
  }

  h1 {
    font-size: 11rem;
    margin-bottom: 1rem;
    margin: 0;

    @media screen and (max-width: 1024px) {
      font-size: 10rem;
    }

    @media screen and (max-width: 860px) {
      font-size: 9rem;
    }

    @media screen and (max-width: 740px) {
      font-size: 8rem;
    }

    @media screen and (max-width: 660px) {
      font-size: 8rem;
    }

    @media screen and (max-width: 560px) {
      font-size: 7rem;
    }

    @media screen and (max-width: 480px) {
      font-size: 6rem;
    }

    @media screen and (max-width: 375px) {
      font-size: 5.5rem;
    }
  }

  .custom-emoji-pack {
    margin-left: 36px;
  }

  .top-emoji-pack {
    background: $color-complementary-1;

    &:hover {
      background: lighten($color-complementary-1, 3%);
    }
  }

  .custom-emoji-pack {
    background: $color-complementary-3;
    color: $color-complementary-1;

    &:hover {
      background: lighten($color-complementary-3, 3%);
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

  @media screen and (max-width: 800px) {
    .custom-emoji-pack,
    .top-emoji-pack {
      display: block;

      margin-left: auto;
      margin-right: auto;

      width: 416px;
    }

    .top-emoji-pack {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-width: 500px) {
    .custom-emoji-pack,
    .top-emoji-pack {
      width: 90vw;
    }
  }

  .back {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);

    color: $color-complementary-2;
    text-decoration: none;
    font-size: 1.8rem;

    opacity: 0.9;
  }
}
</style>
