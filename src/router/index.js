import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: "/users",
    name: "Users",
    component: () => import("../components/UsingSlot/UserList.vue"),
  },
  {
    path: "/tickers",
    name: "Tickers",
    component: () => import("@/components/Ticker/TickerApp.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
