import { useQueryClient } from "@tanstack/react-query";
import { useInternetIdentity } from "./useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "./useQueries";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const saveProfile = useSaveCallerUserProfile();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return {
    identity,
    isAuthenticated,
    isLoggingIn: loginStatus === "logging-in",
    isInitializing,
    userProfile: isAuthenticated ? userProfile : null,
    profileLoading: isAuthenticated ? profileLoading : false,
    profileFetched: isAuthenticated ? profileFetched : true,
    login: handleLogin,
    logout: handleLogout,
    saveProfile: saveProfile.mutateAsync,
    isSavingProfile: saveProfile.isPending,
  };
}
