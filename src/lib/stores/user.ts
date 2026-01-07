import { writable, derived } from 'svelte/store';
import type { AuthSession } from '$lib/server/auth';

interface UserState {
  user: AuthSession | null;
  loading: boolean;
  initialized: boolean;
}

function createUserStore() {
  const { subscribe, set, update } = writable<UserState>({
    user: null,
    loading: true,
    initialized: false
  });
  
  return {
    subscribe,
    
    setUser(user: AuthSession | null) {
      update(state => ({ ...state, user, loading: false, initialized: true }));
    },
    
    setLoading(loading: boolean) {
      update(state => ({ ...state, loading }));
    },
    
    setInitialized(initialized: boolean) {
      update(state => ({ ...state, initialized }));
    },
    
    async init() {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const user = await response.json();
          update(state => ({ ...state, user, loading: false, initialized: true }));
        } else {
          update(state => ({ ...state, user: null, loading: false, initialized: true }));
        }
      } catch {
        update(state => ({ ...state, user: null, loading: false, initialized: true }));
      }
    },
    
    async logout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        set({ user: null, loading: false, initialized: true });
      }
    },
    
    reset() {
      set({ user: null, loading: false, initialized: false });
    }
  };
}

export const userStore = createUserStore();

export const isAuthenticated = derived(
  userStore,
  $user => $user.user !== null && !$user.loading
);

export const userTier = derived(
  userStore,
  $user => $user.user?.tier || 'free'
);

export const isPro = derived(
  userStore,
  $user => $user.user?.tier === 'pro' || $user.user?.tier === 'premium'
);

export const isPremium = derived(
  userStore,
  $user => $user.user?.tier === 'premium'
);
