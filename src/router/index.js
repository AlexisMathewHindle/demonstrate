// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
// import ListComponent from "../components/ListComponent.vue"; // Example component
import HomeComponent from "@/components/HomeComponent.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent,
  },
  {
    path: "/guides",
    name: "Guides",
    props: {
      type: "guides",
    },
    component: () => import("@/components/ListComponent.vue"),
  },
  {
    path: "/stories",
    props: {
      type: "stories",
    },
    name: "Stories",
    component: () => import("@/components/ListComponent.vue"),
  },
  {
    path: "/content/",
    name: "ContentView",
    component: () => import("@/components/ContentComponent.vue"),
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Make sure the BASE_URL is correctly set or simply use '/'
  routes,
});

export default router;
