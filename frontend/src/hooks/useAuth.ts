import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useGetCallerUserRole, useIsCallerAdmin } from './useQueries';

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

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
    userRole,
    roleLoading,
    isAdmin: isAdmin ?? false,
    adminLoading,
    principalId: identity?.getPrincipal().toString(),
  };
}
