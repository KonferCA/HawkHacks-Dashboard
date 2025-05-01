import type { AccessControlFn } from "@/navigation/AccessControl/types";
import type { RouteObject } from "react-router-dom";
import type { paths } from "./data";

export type Paths = typeof paths;

/**
 * Defines the page header information for each route
 */
export interface HeaderInfo {
	title: string;
	subTitle: string;
}

/**
 * Context value interface for the RoutesContext
 */
export interface RoutesContextValue {
	routes: RouteConfig[]; // Routes configured for React Router
	loadingRoutes: boolean; // Whether routes are currently loading
}

/**
 * Extended RouteObject that includes access control and page wrapper configuration
 */
export type RouteConfig = RouteObject & {
	withPageWrapper?: boolean; // Whether to wrap route with PageWrapper
	fallbackRedirect?: string; // Where to redirect if access denied
	accessCheck?: AccessControlFn | AccessControlFn[]; // Function or array of functions to check access permission
	children?: RouteConfig[]; // Nested routes
};
