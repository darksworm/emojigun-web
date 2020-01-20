<template>
  <div id="home">
    <DownloadTopEmojisButton>
      <button
        class="top-emoji-pack bttn-slant bttn-lg bttn-success bttn-primary"
      >
        Download top emoji pack
      </button>
    </DownloadTopEmojisButton>

    <router-link to="custom" class="custom-pack">
      <button class="custom-emoji-pack bttn-slant bttn-lg bttn-secondary">
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

<style lang="scss">
@import '../styles/colors.scss';

#home {
  width: 100%;
  text-align: center;

  .custom-emoji-pack {
    margin-left: 24px;
  }

  button {
    padding: 16px 30px;
  }
}
</style>
