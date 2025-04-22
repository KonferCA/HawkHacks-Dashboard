import { useEffect, useMemo, useRef, useState, type FC } from "react";
import type { ComponentProps } from "@/components/types";
import { BrowserRouter, type RouteObject, useRoutes } from "react-router-dom";

import { AccessControl } from "@/navigation/AccessControl/AccessControl";
import { LoadingAnimation } from "@/components";
import { useAuth } from "@/providers";
import { useApplications } from "@/hooks/use-applications";

// Pages
import {
    AdminPage,
    LoginPage,
    NetworkingPage,
    NotFoundPage,
    TicketPage,
    VerifyEmailPage,
    HomePage,
    PerksPage,
    SchedulePage,
} from "@/pages";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
import { MyTeamPage } from "@/pages/MyTeam.page";
import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";
import { JoinTeamPage } from "@/pages/JoinTeam.page";
import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";
import { ApplicationPage } from "@/pages/Application/Application.page";

// Local imports
import { isAdmin, isAuthenticated, hasVerifiedEmail } from "./accessChecks";
import type { RouteConfig } from "./types";
import { useRouter } from "./hooks";
import { paths } from "./data";
import { RoutesContext } from "./context";

/**
 * Converts RouteConfig to React Router's RouteObject with AccessControl wrapper
 * This handles applying access control to routes that require it
 */
const convertToRouteObjects = (routeConfigs: RouteConfig[]): RouteObject[] => {
    return routeConfigs.map((config) => {
        // If there's an access check, wrap the element with AccessControl
        if (config.accessCheck || config.redirectTo) {
            return {
                path: config.path,
                element: (
                    <AccessControl
                        accessCheck={config.accessCheck}
                        redirectTo={config.redirectTo}
                        withPageWrapper={config.withPageWrapper}
                    />
                ),
                children: [
                    {
                        path: "",
                        element: config.element,
                        children: config.children
                            ? convertToRouteObjects(config.children)
                            : undefined,
                    },
                ],
            };
        }

        // No access check, return the route object directly
        return {
            path: config.path,
            element: config.element,
            children: config.children
                ? convertToRouteObjects(config.children)
                : undefined,
        };
    });
};

/**
 * Inner router component that uses React Router's useRoutes hook
 * Handles loading state while routes are being prepared
 */
const InnerRouter = () => {
    const { routes, loadingRoutes } = useRouter();
    const routeObjs = useMemo(() => {
        // Convert to React Router compatible objects
        return convertToRouteObjects(routes);
    }, [routes]);
    const availableRoutes = useRoutes(routeObjs);

    if (loadingRoutes) return <LoadingAnimation />;

    return availableRoutes;
};

/**
 * Router component that wraps InnerRouter with BrowserRouter
 */
const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
};

/**
 * Routes provider that controls what routes are available and should be rendered
 * Manages route generation, access control, and loading states
 */
export const RoutesProvider: FC<ComponentProps> = () => {
    // State for triggering route refresh
    const [refresh, setRefresh] = useState(false);
    // State for tracking loading state
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    // Ref for timeout to manage loading state
    const timeoutRef = useRef<number | null>(null);
    // Get current user and application data
    const { currentUser } = useAuth();
    const { applications } = useApplications();

    // State for storing generated routes
    const routes = useMemo(() => {
        // Public routes that don't require authentication
        const publicRoutes: RouteConfig[] = [
            {
                path: paths.login,
                element: <LoginPage />,
            },
            {
                path: paths.notFound,
                element: <NotFoundPage />,
            },
        ];

        // Routes requiring basic authentication
        const authenticatedRoutes: RouteConfig[] = [
            {
                path: paths.verifyEmail,
                withPageWrapper: true,
                element: <VerifyEmailPage />,
                accessCheck: isAuthenticated,
                redirectTo: paths.login,
            },
        ];

        // Routes requiring email verification
        const verifiedEmailRoutes: RouteConfig[] = [
            {
                path: paths.home,
                withPageWrapper: true,
                element: <HomePage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.schedule,
                withPageWrapper: true,
                element: <SchedulePage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.networking,
                withPageWrapper: true,
                element: <NetworkingPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.myTicket,
                withPageWrapper: true,
                element: <TicketPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.application,
                withPageWrapper: true,
                element: <ApplicationPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.submitted,
                withPageWrapper: true,
                element: <PostSubmissionPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.verifyRSVP,
                withPageWrapper: true,
                element: <VerifyRSVP />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.myTeam,
                withPageWrapper: true,
                element: <MyTeamPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.joinTeam,
                withPageWrapper: true,
                element: <JoinTeamPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.ticket,
                withPageWrapper: true,
                element: <ViewTicketPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.perks,
                withPageWrapper: true,
                element: <PerksPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail],
                redirectTo: paths.verifyEmail,
            },
        ];

        // Admin-only routes
        const adminRoutes: RouteConfig[] = [
            {
                path: paths.admin,
                withPageWrapper: true,
                element: <AdminPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
                redirectTo: paths.home,
            },
            {
                path: paths.adminViewTicket,
                withPageWrapper: true,
                element: <AdminViewTicketPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
                redirectTo: paths.home,
            },
            {
                path: paths.adminManageEvents,
                withPageWrapper: true,
                element: <AdminManageEventsPage />,
                accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
                redirectTo: paths.home,
            },
        ];

        // Combine all route groups
        return [
            ...publicRoutes,
            ...authenticatedRoutes,
            ...verifiedEmailRoutes,
            ...adminRoutes,
        ];
    }, []);

    // Manage loading state with delay to prevent flashing
    useEffect(() => {
        setLoadingRoutes(true);

        // Cleanup function to clear timeout
        const cleanUp = () => {
            if (timeoutRef.current !== null)
                window.clearTimeout(timeoutRef.current);
        };

        // Clear any existing timeout
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

        // Set timeout to turn off loading state after delay
        timeoutRef.current = window.setTimeout(
            () => setLoadingRoutes(false),
            1500
        );

        return cleanUp;
    }, [refresh, currentUser, applications]);

    // Function to trigger route refresh
    const refreshRoutes = () => setRefresh((r) => !r);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                loadingRoutes,
                refreshRoutes,
            }}
        >
            {loadingRoutes ? <LoadingAnimation /> : <Router />}
        </RoutesContext.Provider>
    );
};
