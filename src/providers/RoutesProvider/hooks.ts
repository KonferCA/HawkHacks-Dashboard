import { useContext, useMemo } from "react";

import { useLocation } from "react-router-dom";
// Local imports
import { RoutesContext } from "./context";
import { titles } from "./data";
import type { HeaderInfo } from "./types";

/**
 * Hook to access the routes context
 * Provides access to routes, paths, titles and route control functions
 */
export function useRouter() {
	return useContext(RoutesContext);
}

/**
 * Hook to get header information for current route
 * Uses current location to determine the appropriate header info
 */
export function useHeaderInfo() {
	const location = useLocation();
	const info: HeaderInfo | undefined = useMemo(
		() => titles[location.pathname],
		[titles, location.pathname],
	);
	return info;
}

/**
 * Hook to get all the route definitions
 */
export function useRouteDefinitions() {
	const router = useRouter();
	return router.routes;
}
