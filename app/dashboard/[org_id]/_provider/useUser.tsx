import { createClientComponentClient } from '@/app/_utils/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useUser() {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = useCallback(async () => {
    const logoutPromise = new Promise(async (resolve, reject) => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });

    await toast.promise(logoutPromise, {
      loading: 'Logging out...',
      success: 'Logged out successfully',
      error: 'Failed to logout',
    });
    router.push('/login');
  }, [router, supabase.auth]);

  //Handle refresh session
  const handleRefreshSession = useCallback(async () => {
    const refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.refreshSession();

        if (error) {
          throw error;
        }
        session?.user && setUser(session.user);
        resolve(true);
      } catch (error) {
        reject(false);
      } finally {
        router.refresh();
      }
    });
  }, [router, supabase.auth]);

  //! UseEffect for auth realtime
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN': {
          session?.user && setUser(session.user);
          break;
        }

        case 'USER_UPDATED': {
          handleRefreshSession();
          break;
        }

        case 'SIGNED_OUT': {
          router.push('/login');
          break;
        }

        default:
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, handleLogout, handleRefreshSession };
}
