import type { ApplicationsHookValue } from "@/hooks/use-applications";
import type { UserWithClaims } from "@/providers";

/**
 * Context object provided to access control functions
 * Contains current user and their application data
 */
export interface AccessControlContext {
	user: UserWithClaims | null;
	applicationsCtx: ApplicationsHookValue;
}

/**
 * Function type for access control checks
 * Returns true if access should be granted, false if it should be denied
 */
export type AccessControlFn = (context: AccessControlContext) => boolean;

/**
 * Props for AccessControl component
 * @property accessCheck - Single function or array of functions to determine if access should be granted
 * @property fallbackRedirect - Path to redirect to if access check fails but doesn't specify a redirect
 */
export interface AccessControlProps {
	accessCheck?: AccessControlFn | AccessControlFn[];
	fallbackRedirect?: string;
}
