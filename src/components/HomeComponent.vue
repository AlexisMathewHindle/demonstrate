<template>
  <div class="branch__create">
    <label for="title">Enter title:</label>
    <input v-model="title" name="title" />

    <div class="checkbox__wrapper">
      <p>Select type of content:</p>
      <div class="checkbox">
        <label for="story">Story</label>
        <input
          v-model="type"
          id="story"
          name="contentType"
          value="story"
          type="radio"
        />
      </div>
      <div class="checkbox">
        <label for="guide">Guide</label>
        <input
          v-model="type"
          id="guide"
          name="contentType"
          value="guide"
          type="radio"
        />
      </div>
    </div>

    <label for="username">Username:</label>
    <input v-model="username" name="username" />
    <div class="content">
      <label for="content">Enter Content:</label>
      <div>
        <QuillEditor
          theme="snow"
          toolbar="minimal"
          contentType="text"
          v-model:content="content"
        />
      </div>
    </div>

    <button @click="createBranch">Create Branch</button>
  </div>

  <div>
    <ul v-if="branches.length">
      <li v-for="branch in branches" :key="branch.name">
        <span>{{ branch.name }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="red"
        >
          <path
            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
          />
        </svg>
      </li>
    </ul>
    <p v-else>No branches found or click 'Fetch Branches' to load.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const title = ref("");
const type = ref("");
const username = ref("");
const content = ref("");
const branches = ref([]);
const repo = "AlexisMathewHindle/demonstrate";
const token = process.env.VUE_APP_GITHUB_TOKEN; // Ideally, this should not be hardcoded

const fetchBranches = async () => {
  try {
    const response = await axios.get(
      `https://us-central1-demonstrate-1d527.cloudfunctions.net/listBranches?repo=${repo}&token=${token}`
    );
    branches.value = response.data;
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    alert("Failed to fetch branches. Check the console for more information.");
  }
};

const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const createBranch = async () => {
  console.log(content.value);
  const today = new Date();
  const formattedDate = formatDate(today);
  const randomId = Math.floor(Math.random() * 1000);
  const branchName = `${title.value.replace(/\s+/g, "-").toLowerCase()}-${
    type.value
  }-${username.value
    .replace(/\s+/g, "-")
    .toLowerCase()}-${formattedDate}-${randomId}`;
  console.log("Generated branch name:", branchName);

  try {
    const response = await axios.post(
      "https://us-central1-demonstrate-1d527.cloudfunctions.net/createBranchAndPR",
      {
        data: {
          token,
          repo,
          branchName,
          content: content.value,
          type: type.value,
          title: title.value,
          body: "Body of the pull request", // Add the body of the PR
        },
      }
    );
    console.log("Branch created:", response.data);
  } catch (error) {
    console.error("Error creating branch:", error);
    alert("Error creating branch. Check the console for more information.");
  }
};

onMounted(() => {
  fetchBranches();
});
</script>

<style>
@import "@vueup/vue-quill/dist/vue-quill.snow.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 40px;
}

.branch__create {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
}

.checkbox__wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin: 10px 0;
}

.checkbox__wrapper p {
  margin: 0px 0 10px 0;
}

.checkbox {
  display: flex;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  width: 100%;
}

.content div {
  width: 100%;
}

.content label {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
