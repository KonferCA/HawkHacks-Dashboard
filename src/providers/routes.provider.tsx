import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type FC,
} from "react";
import type { ComponentProps } from "@/components/types";
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
import {
    BrowserRouter,
    type RouteObject,
    useLocation,
    useRoutes,
} from "react-router-dom";
import { useAuth } from "./auth.provider";
import { AccessControl } from "@/navigation/AccessControl/AccessControl";
import { AccessControlFn } from "@/navigation/AccessControl/AccessControl.types";
import { LoadingAnimation } from "@/components";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
import { MyTeamPage } from "@/pages/MyTeam.page";
import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";
import { JoinTeamPage } from "@/pages/JoinTeam.page";
import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";
import { ApplicationPage } from "@/pages/Application/Application.page";

/**
 * Defines all application routes as URL paths
 * Used for consistent route references throughout the application
 */
interface PathObject {
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
interface HeaderInfo {
    title: string;
    subTitle: string;
}

/**
 * Context value interface for the RoutesContext
 */
interface RoutesContextValue {
    routes: RouteConfig[]; // Routes configured for React Router
    paths: PathObject; // All application paths
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
    accessCheck?: AccessControlFn; // Function to check access permission
    children?: RouteConfig[]; // Nested routes
};

/**
 * Centralized definition of all application paths
 */
const paths: PathObject = {
    admin: "/admin",
    adminViewTicket: "/admin/ticket/:ticketId",
    adminManageEvents: "/admin/manage",
    notFound: "*",
    login: "/login",
    home: "/",
    verifyEmail: "/verify-email",
    schedule: "/schedule",
    networking: "/networking",
    myTicket: "/my-ticket",
    application: "/application",
    submitted: "/submitted",
    verifyRSVP: "/verify-rsvp",
    myTeam: "/my-team",
    joinTeam: "/join-team",
    myApp: "/my-application",
    ticket: "/ticket/:ticketId",
    perks: "/perks",
};

/**
 * Page titles and subtitles for each route
 * Used for displaying consistent header information
 */
const titles: Record<string, HeaderInfo> = {
    [paths.home]: {
        title: "Home",
        subTitle: "Welcome to the home page",
    },
    [paths.schedule]: {
        title: "Schedule",
        subTitle: "View the schedule for the weekend!",
    },
    [paths.networking]: {
        title: "Networking",
        subTitle: "A quick way to connect with new people at HawkHacks!",
    },
    [paths.application]: {
        title: "Application",
        subTitle: "Apply to participate in the hackathon now!",
    },
    [paths.verifyEmail]: {
        title: "Verify Your Email",
        subTitle: "Please check your email inbox.",
    },
    [paths.verifyRSVP]: {
        title: "Verify Your RSVP",
        subTitle: "All checkboxes are required.",
    },
    [paths.myTicket]: {
        title: "Ticket",
        subTitle:
            "This ticket is required for registration at our HawkHacks sign-in desk.\nKeep this ticket safe - download or add it to your wallet for convenience!",
    },
    [paths.myTeam]: {
        title: "My Team",
        subTitle:
            "Create your dream team! Add, manage, and view your teammates.",
    },
    [paths.joinTeam]: {
        title: "Join Team",
        subTitle: "Awesome, it looks like you have found teammates!",
    },
    [paths.ticket]: {
        title: "View Ticket",
        subTitle: "Some good thing here",
    },
    [paths.perks]: {
        title: "Perks",
        subTitle: "Explore the amazing perks available at HawkHacks!",
    },
};

/**
 * Create context for routes with default values
 */
const RoutesContext = createContext<RoutesContextValue>({
    routes: [],
    paths,
    titles,
    loadingRoutes: true,
    refreshRoutes: () => {},
});

/**
 * Checks if user is authenticated (logged in)
 */
const isAuthenticated: AccessControlFn = ({ user }) => !!user;

/**
 * Checks if user has verified their email
 */
const hasVerifiedEmail: AccessControlFn = ({ user }) =>
    !!user && user.emailVerified;

/**
 * Checks if user has verified their email and is authenticated
 */
const isVerifiedAndAuthenticated: AccessControlFn = (ctx) =>
    isAuthenticated(ctx) && hasVerifiedEmail(ctx);

/**
 * Checks if user is an admin
 */
const isAdmin: AccessControlFn = ({ user }) => !!user && user.hawkAdmin;

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
    const { currentUser, userApp } = useAuth();

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
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.schedule,
                withPageWrapper: true,
                element: <SchedulePage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.networking,
                withPageWrapper: true,
                element: <NetworkingPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.myTicket,
                withPageWrapper: true,
                element: <TicketPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.application,
                withPageWrapper: true,
                element: <ApplicationPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.submitted,
                withPageWrapper: true,
                element: <PostSubmissionPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.verifyRSVP,
                withPageWrapper: true,
                element: <VerifyRSVP />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.myTeam,
                withPageWrapper: true,
                element: <MyTeamPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.joinTeam,
                withPageWrapper: true,
                element: <JoinTeamPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.ticket,
                withPageWrapper: true,
                element: <ViewTicketPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
            {
                path: paths.perks,
                withPageWrapper: true,
                element: <PerksPage />,
                accessCheck: isVerifiedAndAuthenticated,
                redirectTo: paths.verifyEmail,
            },
        ];

        // Admin-only routes
        const adminRoutes: RouteConfig[] = [
            {
                path: paths.admin,
                withPageWrapper: true,
                element: <AdminPage />,
                accessCheck: isAdmin,
                redirectTo: paths.notFound,
            },
            {
                path: paths.adminViewTicket,
                withPageWrapper: true,
                element: <AdminViewTicketPage />,
                accessCheck: isAdmin,
                redirectTo: paths.notFound,
            },
            {
                path: paths.adminManageEvents,
                withPageWrapper: true,
                element: <AdminManageEventsPage />,
                accessCheck: isAdmin,
                redirectTo: paths.notFound,
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
    }, [refresh, currentUser, userApp]);

    // Function to trigger route refresh
    const refreshRoutes = () => setRefresh((r) => !r);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                paths,
                titles,
                loadingRoutes,
                refreshRoutes,
            }}
        >
            {loadingRoutes ? <LoadingAnimation /> : <Router />}
        </RoutesContext.Provider>
    );
};

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
        [titles, location.pathname]
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
