<template>
  <div>
    <h1>Select a Markdown File</h1>
    <ul>
      <li v-for="file in files" :key="file" @click="fetchMarkdown(file)">
        {{ file }}
      </li>
    </ul>
    <div v-html="content"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export default {
  name: "MarkdownDisplay",
  setup() {
    const files = ref([]);
    const content = ref("");

    const fetchMarkdownFiles = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-demonstrate-1d527.cloudfunctions.net/listMarkdownFiles"
        );

        console.log(response.data, "-bbbom");
        files.value = response.data;
      } catch (error) {
        console.error("Error fetching markdown files:", error);
      }
    };

    const fetchMarkdown = async (file) => {
      try {
        const response = await axios.get(
          `https://us-central1-demonstrate-1d527.cloudfunctions.net/getMarkdownFile`,
          {
            params: { file },
          }
        );
        content.value = md.render(response.data);
      } catch (error) {
        console.error("Error fetching markdown file:", error);
      }
    };

    onMounted(fetchMarkdownFiles);

    return {
      files,
      content,
      fetchMarkdown,
    };
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}

li:hover {
  text-decoration: none;
}
</style>
