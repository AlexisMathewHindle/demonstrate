Copy code
<template>
  <div id="app">
    <h2><router-link to="/">Demonstrate</router-link></h2>
    <div class="nav">
      <router-link to="/guides">Guides</router-link>
      <router-link to="/stories">Stories</router-link>
    </div>
    <!-- This is where components for each route will be rendered -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Global styles */
.nav {
  max-width: 50%;
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
}
</style>
