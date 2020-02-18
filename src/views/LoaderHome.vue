<template>
  <div id="home">
    <h1>EMOJI<span class="alt-color">LOADER</span></h1>
    <DownloadTopEmojisButton>
      <button class="top-emoji-pack">
        Download top emoji pack
      </button>
    </DownloadTopEmojisButton>

    <router-link to="custom" class="custom-pack">
      <button class="custom-emoji-pack">
        Create custom emoji pack
      </button>
    </router-link>
  </div>
</template>

<script>
import DownloadTopEmojisButton from '../components/DownloadTopEmojisButton';

export default {
  name: 'Home',
  mounted() {},
  components: {DownloadTopEmojisButton},
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
    margin-bottom: 0.5vw;
    margin: 0;
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
    font-size: 26px;
  }
}
</style>
