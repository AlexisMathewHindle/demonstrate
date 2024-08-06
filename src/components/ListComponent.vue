<template>
  <ul>
    <li v-for="file in files" :key="file.fileId">
      <router-link
        :to="{
          name: 'ContentView',
          params: { type: type, fileId: file.fileId },
        }"
      >
        {{ file.title }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { ref, watch } from "vue";

// Predefined require.contexts
const guidesContext = require.context(
  "../assets/markdown/guides/",
  false,
  /\.md$/
);
const storiesContext = require.context(
  "../assets/markdown/stories/",
  false,
  /\.md$/
);

export default {
  props: {
    type: String, // 'guides' or 'stories'
  },
  setup(props) {
    const files = ref([]);

    const loadFiles = () => {
      let context;
      if (props.type === "guides") {
        context = guidesContext;
      } else if (props.type === "stories") {
        context = storiesContext;
      } else {
        return; // or handle error
      }

      files.value = context.keys().map((key) => {
        const contents = context(key).default;
        console.log(contents);
        // const titleLine = contents
        //   .split("\n")
        //   .find((line) => line.startsWith("#")); // Find the first Markdown header
        // return {
        //   fileId: key.replace("./", "").replace(".md", ""),
        //   title: titleLine
        //     ? titleLine.replace("# ", "").trim()
        //     : "No Title Found", // Ensuring a title is found
        // };
        return {
          fileId: key.replace("./", "").replace(".md", ""),
          title: contents,
        };
      });
    };

    // Reactively load files when `type` prop changes
    watch(() => props.type, loadFiles, { immediate: true });

    // onMounted(loadFiles);

    return { files };
  },
};
</script>
