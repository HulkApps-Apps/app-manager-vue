<script>
import Vue from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
import { Banners } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Banners,
  }
});
</script>

<template>
  <div id="app">
    <Banners type="header" />
    -------------------------------
    <Banners type="footer" />

  </div>
</template>
