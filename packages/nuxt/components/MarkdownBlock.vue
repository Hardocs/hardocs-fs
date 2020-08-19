<template>
  <div>
    <textarea
      class="yaml"
      placeholder="Enter text in yaml format...
    title: your title goes here
    description: your description goes here
    "
      v-model="yaml"
      name="yaml"
      aria-label="yaml editor"
    ></textarea>
    <br />
    <button @click="logToConsole">log to console</button>
    <br />
    <br />

    <preview>title: {{ $data }}</preview>
  </div>
</template>

<script lang="ts">
export default {
  data: function () {
    return {
      yaml: `
title: This is default title
description: Just a basic description`
    };
  },

  methods: {
    logToConsole: function () {
      const json = JSON.stringify(this.yaml);
      const f = json.split('\\n');
      const title = f
        .find((val) => val.includes('title: '))
        .replace('title: ', '');
      const description = f
        .find((val) => val.includes('description: '))
        .replace('description: ', '');
      console.log({ title, description });
    }
  }
};
/*
 * FEATURE:
 * Given an input field for text
 * when user writes and then suscribes the text (the text will be a docs object..)
 * then store the text in Vuex....
 *
 */
</script>

<style>
.yaml {
  width: 400px;
  height: 300px;
  margin: 1rem auto;
}
</style>
