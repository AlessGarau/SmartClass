import { type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userQueryOptions } from '../../api/queryOptions';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { data: userData, isLoading: isLoadingUser } = useQuery(userQueryOptions.me());
  const loginMutation = useMutation({
    ...userQueryOptions.login(),
    onError: () => {
      queryClient.removeQueries({ queryKey: userQueryOptions.me().queryKey });
    },
  });
  const logoutMutation = useMutation({
    ...userQueryOptions.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const user = userData?.data
  const isLoading = isLoadingUser || loginMutation.isPending || logoutMutation.isPending;

  const value = {
    user,
    loginMutation,
    logoutMutation,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};