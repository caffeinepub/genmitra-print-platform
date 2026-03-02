import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const profileQuery = useGetCallerUserProfile();

  return {
    identity,
    isAuthenticated,
    isLoggingIn,
    login,
    logout: clear,
    userProfile: profileQuery.data ?? null,
    profileLoading: profileQuery.isLoading,
    profileFetched: profileQuery.isFetched,
  };
}
