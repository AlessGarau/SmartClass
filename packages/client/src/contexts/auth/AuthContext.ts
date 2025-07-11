import { createContext, useContext } from "react";
import type { User } from "../../types/User";
import type { LoginCredentials } from "../../types/User";
import type { UseMutationResult } from "@tanstack/react-query";

interface AuthContextType {
    user: User | undefined;
    loginMutation: UseMutationResult<{ data: User }, Error, LoginCredentials>;
    logoutMutation: UseMutationResult<void, Error, void>;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};