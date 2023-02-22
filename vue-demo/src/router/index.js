import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ReusedView from "../views/ReusedView.vue";
import Reused2View from "../views/Reused2View.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      children: [
        {
          path: '/reused/:p',
          name: 'reused',
          component: ReusedView,
        }
      ]
    },
    // {
    //   path: "/reused/:p",
    //   name: "reused",
    //   component: ReusedView,
    //   beforeEnter: () => console.log('beforeEnter')
    // },
    {
      path: "/reused2/:p",
      name: "reused2",
      component: Reused2View,
      beforeEnter: () => console.log('beforeEnter')
    },
  ],
});

export default router;

router.beforeEach(() => {
  console.log('beforeEach')
})

router.beforeResolve(() => {
  console.log('beforeResolve')
})

router.afterEach(() => {
  console.log('afterEach')
})
