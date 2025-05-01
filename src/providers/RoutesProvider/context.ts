import { createContext } from "react";
import type { RoutesContextValue } from "./types";

/**
 * Create context for routes with default values
 */
export const RoutesContext = createContext<RoutesContextValue>({
	routes: [],
	loadingRoutes: true,
	refreshRoutes: () => {},
});
