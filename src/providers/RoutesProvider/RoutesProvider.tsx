import type { ComponentProps } from "@/components/types";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, type RouteObject, useRoutes } from "react-router-dom";

import { LoadingAnimation } from "@/components";
import { useApplications } from "@/hooks/use-applications";
import { AccessControl } from "@/navigation/AccessControl/AccessControl";
import { useAuth } from "@/providers";

// Public pages
import { LoginPage } from "@/pages/login.page";

// Private pages
import { SchedulePage } from "@/pages/schedule.page";
import { NetworkingPage } from "@/pages/networking.page";
import { PerksPage } from "@/pages/perks.page";
import { HomePage } from "@/pages/home.page";
import { MyTicketPage } from "@/pages/my-ticket.page";
import { MyTeamPage } from "@/pages/my-team.page";
import { JoinTeamPage } from "@/pages/join-team.page";
import { ApplyPage } from "@/pages/apply.page";

// Admin pages
import { AdminPage } from "@/pages/admin/admin.page";
import { AdminManageEventsPage } from "@/pages/admin/manage-events.page";
import { AdminViewTicketPage } from "@/pages/admin/view-ticket.page";

// Miscellaneous pages
import { NotFoundPage } from "@/pages/miscellaneous/not-found.page";
import { VerifyEmailPage } from "@/pages/miscellaneous/verify-email.page";
import { PostSubmissionPage } from "@/pages/miscellaneous/post-submission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/verify-rsvp.page";
import { ViewTicketPage } from "@/pages/miscellaneous/view-ticket.page";

// Local imports
import {
	hasApplied,
	hasRSVP,
	hasVerifiedEmail,
	isAccepted,
	isAdmin,
	isAppOpen,
	isAuthenticated,
} from "./accessChecks";
import { RoutesContext } from "./context";
import { paths } from "./data";
import { useRouter } from "./hooks";
import type { RouteConfig } from "./types";
import { Redirect } from "@/navigation/redirect";
import { ApplicationPage } from "@/pages/application.page";

/**
 * Converts RouteConfig to React Router's RouteObject with AccessControl wrapper
 * This handles applying access control to routes that require it
 */
const convertToRouteObjects = (routeConfigs: RouteConfig[]): RouteObject[] => {
	return routeConfigs.map((config) => {
		// If there's an access check, wrap the element with AccessControl
		if (config.accessCheck) {
			return {
				path: config.path,
				element: (
					<AccessControl
						accessCheck={config.accessCheck}
						fallbackRedirect={config.fallbackRedirect}
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
	// State for tracking loading state
	const [loadingRoutes, setLoadingRoutes] = useState(true);
	// Ref for timeout to manage loading state
	const timeoutRef = useRef<number | null>(null);
	// Get current user and application data
	const { isLoading: loadingAuth } = useAuth();
	const { isLoading: loadingApplications } = useApplications();

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
			{
				path: paths.ticket,
				element: <ViewTicketPage />,
			},
		];

		// Routes requiring basic authentication
		const authenticatedRoutes: RouteConfig[] = [
			{
				path: paths.verifyEmail,
				element: <VerifyEmailPage />,
				accessCheck: isAuthenticated,
			},
		];

		// Routes requiring email verification
		const verifiedEmailRoutes: RouteConfig[] = [
			{
				path: paths.home,
				element: <HomePage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
			},
			{
				path: paths.schedule,
				element: <SchedulePage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
			{
				path: paths.networking,
				element: <NetworkingPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
			{
				path: paths.myTicket,
				element: <MyTicketPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
			{
				path: paths.apply,
				element: <ApplyPage />,
				accessCheck: [
					isAuthenticated,
					hasVerifiedEmail,
					(ctx) => {
						if (hasApplied(ctx)) throw new Redirect(paths.application);
						return true;
					},
					isAppOpen,
				],
			},
			{
				path: paths.application,
				element: <ApplicationPage />,
				accessCheck: [
					isAuthenticated,
					hasVerifiedEmail,
					(ctx) => {
						if (!hasApplied(ctx)) throw new Redirect(paths.apply);
						return true;
					},
				],
			},
			{
				path: paths.submitted,
				element: <PostSubmissionPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, hasApplied],
			},
			{
				path: paths.verifyRSVP,
				element: <VerifyRSVP />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted],
			},
			{
				path: paths.myTeam,
				element: <MyTeamPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
			{
				path: paths.joinTeam,
				element: <JoinTeamPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
			{
				path: paths.perks,
				element: <PerksPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAccepted, hasRSVP],
			},
		];

		// Admin-only routes
		const adminRoutes: RouteConfig[] = [
			{
				path: paths.admin,
				element: <AdminPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
			},
			{
				path: paths.adminViewTicket,
				element: <AdminViewTicketPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
			},
			{
				path: paths.adminManageEvents,
				element: <AdminManageEventsPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
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
			if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
		};

		// Clear any existing timeout
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

		if (routes.length && !loadingApplications && !loadingAuth) {
			// Prevent random flashes in the DOM due to updates
			timeoutRef.current = window.setTimeout(
				() => setLoadingRoutes(false),
				250,
			);
			return cleanUp;
		}

		// Set timeout to turn off loading state after delay
		timeoutRef.current = window.setTimeout(() => setLoadingRoutes(false), 1500);

		return cleanUp;
	}, [loadingAuth, routes, loadingApplications]);

	return (
		<RoutesContext.Provider
			value={{
				routes,
				loadingRoutes,
			}}
		>
			<Router />
		</RoutesContext.Provider>
	);
};
