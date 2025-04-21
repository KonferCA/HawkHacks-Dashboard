import { RouteObject } from "react-router-dom";
import { AccessControlFn } from "@/navigation/AccessControl/types";

/**
 * Defines all application routes as URL paths
 * Used for consistent route references throughout the application
 */
export interface PathObject {
    admin: string;
    adminViewTicket: string;
    adminManageEvents: string;
    notFound: string;
    login: string;
    home: string;
    verifyEmail: string;
    schedule: string;
    networking: string;
    myTicket: string;
    application: string;
    submitted: string;
    verifyRSVP: string;
    myTeam: string;
    joinTeam: string;
    myApp: string;
    ticket: string;
    perks: string;
}

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
    titles: Record<string, HeaderInfo>; // Header info for each path
    loadingRoutes: boolean; // Whether routes are currently loading
    refreshRoutes: () => void; // Function to trigger route refresh
}

/**
 * Extended RouteObject that includes access control and page wrapper configuration
 */
export type RouteConfig = RouteObject & {
    withPageWrapper?: boolean; // Whether to wrap route with PageWrapper
    redirectTo?: string; // Where to redirect if access denied
    accessCheck?: AccessControlFn | AccessControlFn[]; // Function or array of functions to check access permission
    children?: RouteConfig[]; // Nested routes
};
