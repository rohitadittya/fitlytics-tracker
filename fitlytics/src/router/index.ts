import { useUserStore } from '@/stores/user'
import Admin from '@/views/Admin.vue'
import AllUserActivities from '@/views/AllUserActivities.vue'
import Profile from '@/views/profile.vue'
import Stats from '@/views/Stats.vue'
import MyActivities from '@/views/MyActivities.vue'
import UserLogin from '@/views/UserLogin.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: AllUserActivities,
      meta: {
        isAuthenticated: true
      }
    },
    {
      path: '/activities',
      name: 'Activities',
      component: MyActivities,
      meta: {
        isAuthenticated: true
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        isAuthenticated: true,
        isAdmin: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: UserLogin,
      meta: {
        isAuthenticated: false
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        isAuthenticated: true
      }
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
      meta: {
        isAuthenticated: true
      }
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const isUserAuthenticated = userStore.isUserLoggedIn;
  const isUserAdmin = userStore.isAdminLoggedIn;

  if (to.meta.isAuthenticated && !isUserAuthenticated) {
    next({ name: 'Login' });
  } else if (to.meta.isAdmin && !isUserAdmin) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router
