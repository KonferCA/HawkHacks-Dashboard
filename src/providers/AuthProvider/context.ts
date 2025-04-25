import { createContext } from "react";
import { AuthContextValue } from "./types";

export const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    resetPassword: async () => {},
    loginWithProvider: async () => {},
    reloadUser: async () => {},
});
