import { useApplications } from "@/hooks/use-applications";
import { useUser } from "@/providers";
import { type FC, useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { AccessControlContext, AccessControlProps } from "./types";
import { Redirect } from "../redirect";

/**
 * AccessControl component provides route protection based on user authentication and authorization.
 * It acts as a wrapper for routes that need access control, managing both authentication checks
 * and conditional page wrapping.
 *
 * @param accessCheck - Function or array of functions that determine if user has access to the route.
 *                      If an array is provided, all functions must return true for access to be granted.
 * @param fallbackRedirect - Path to redirect to if access check fails but doesn't specify a redirect
 */
export const AccessControl: FC<AccessControlProps> = ({
	accessCheck,
	fallbackRedirect = "/not-found",
}) => {
	// Get current user and application data from context
	const { user } = useUser();
	const applicationsCtx = useApplications();
	const accessOpts = useMemo(() => {
		// If no access check is provided, allow access
		if (typeof accessCheck === "undefined") {
			return { allow: true };
		}

		const ctx: AccessControlContext = {
			user,
			applicationsCtx,
		};

		try {
			// If a single function is provided, use it
			if (typeof accessCheck === "function") {
				return { allow: accessCheck(ctx) };
			}
			if (Array.isArray(accessCheck)) {
				// If an array of functions is provided, all must pass
				return {
					allow: accessCheck.every((check) => check(ctx)),
				};
			}
			throw new Error(
				"Provided access check is not a function nor an array of functions.",
			);
		} catch (e) {
			if (e instanceof Redirect) {
				return { allow: false, redirect: { to: e.to, ...e.opts } };
			}
			// Throw the error if is not a redirect
			throw e;
		}
	}, [user, applicationsCtx, accessCheck]);

	// Check if user meets access requirements, redirect if they don't
	if (!accessOpts.allow) {
		return (
			<Navigate
				to={accessOpts.redirect?.to ?? fallbackRedirect}
				replace={accessOpts.redirect?.replace}
			/>
		);
	}

	return <Outlet />;
};
