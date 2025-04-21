import { createContext } from "react";
import { titles } from "./data";
import type { RoutesContextValue } from "./types";

/**
 * Create context for routes with default values
 */
export const RoutesContext = createContext<RoutesContextValue>({
    routes: [],
    titles,
    loadingRoutes: true,
    refreshRoutes: () => {},
});
