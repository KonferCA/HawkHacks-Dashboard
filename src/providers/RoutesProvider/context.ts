import { createContext } from "react";
import { paths, titles } from "./data";
import type { RoutesContextValue } from "./types";

/**
 * Create context for routes with default values
 */
export const RoutesContext = createContext<RoutesContextValue>({
    routes: [],
    paths,
    titles,
    loadingRoutes: true,
    refreshRoutes: () => {},
});
