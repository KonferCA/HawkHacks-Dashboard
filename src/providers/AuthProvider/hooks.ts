import { useContext } from "react";
import { AuthContext } from "./context";

export const useAuth = () => useContext(AuthContext);
export const useUser = () => {
    const ctx = useContext(AuthContext);
    return ctx.currentUser;
};
