import { Navigate, Outlet } from "react-router-dom";
import { useMemo, type FC } from "react";
import type { AccessControlProps } from "./types";
import { useUser } from "@/providers";
import { useApplications } from "@/hooks/use-applications";
import { PageWrapper } from "@/components";

/**
 * AccessControl component provides route protection based on user authentication and authorization.
 * It acts as a wrapper for routes that need access control, managing both authentication checks
 * and conditional page wrapping.
 *
 * @param accessCheck - Function or array of functions that determine if user has access to the route.
 *                      If an array is provided, all functions must return true for access to be granted.
 * @param redirectTo - Path to redirect to if access check fails
 * @param withPageWrapper - Whether to wrap the route content in a PageWrapper component
 */
export const AccessControl: FC<AccessControlProps> = ({
    accessCheck,
    redirectTo,
    withPageWrapper,
}) => {
    // Get current user and application data from context
    const { user } = useUser();
    const { applications } = useApplications();
    const canAccess = useMemo(() => {
        // If no access check is provided, allow access
        if (typeof accessCheck === "undefined") {
            return true;
        }

        // If a single function is provided, use it
        if (typeof accessCheck === "function") {
            return accessCheck({ user, applications });
        }

        // If an array of functions is provided, all must pass
        return accessCheck.every((check) => check({ user, applications }));
    }, [user, applications, accessCheck]);

    // Check if user meets access requirements, redirect if they don't
    if (!canAccess) {
        return <Navigate to={redirectTo ?? "/not-found"} />;
    }

    // Conditionally wrap content in PageWrapper if specified
    if (withPageWrapper) {
        return (
            <PageWrapper>
                <Outlet />
            </PageWrapper>
        );
    }

    // Otherwise render route content directly
    return <Outlet />;
};
