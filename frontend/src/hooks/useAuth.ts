import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from './useQueries';

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const logout = async () => {
    await clear();
    queryClient.clear();
  };

  return {
    identity,
    isAuthenticated,
    login,
    logout,
    loginStatus,
    isInitializing,
    isLoggingIn,
    userProfile,
    profileLoading,
    profileFetched,
    principalId: identity?.getPrincipal().toString(),
  };
}
