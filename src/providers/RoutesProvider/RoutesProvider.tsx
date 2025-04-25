import type { ComponentProps } from "@/components/types";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, type RouteObject, useRoutes } from "react-router-dom";

import { LoadingAnimation } from "@/components";
import { useApplications } from "@/hooks/use-applications";
import { AccessControl } from "@/navigation/AccessControl/AccessControl";
import { useAuth } from "@/providers";

// Pages
import {
	AdminPage,
	HomePage,
	LoginPage,
	NetworkingPage,
	NotFoundPage,
	PerksPage,
	SchedulePage,
	TicketPage,
	VerifyEmailPage,
} from "@/pages";
import { ApplicationPage } from "@/pages/Application/Application.page";
import { JoinTeamPage } from "@/pages/JoinTeam.page";
import { MyTeamPage } from "@/pages/MyTeam.page";
import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";
import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";

// Local imports
import { hasVerifiedEmail, isAdmin, isAuthenticated } from "./accessChecks";
import { RoutesContext } from "./context";
import { paths } from "./data";
import { useRouter } from "./hooks";
import type { RouteConfig } from "./types";

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
				element: <VerifyEmailPage />,
				accessCheck: isAuthenticated,
				redirectTo: paths.login,
			},
		];

		// Routes requiring email verification
		const verifiedEmailRoutes: RouteConfig[] = [
			{
				path: paths.home,
				element: <HomePage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.schedule,
				element: <SchedulePage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.networking,
				element: <NetworkingPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.myTicket,
				element: <TicketPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.application,
				element: <ApplicationPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.submitted,
				element: <PostSubmissionPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.verifyRSVP,
				element: <VerifyRSVP />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.myTeam,
				element: <MyTeamPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.joinTeam,
				element: <JoinTeamPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.ticket,
				element: <ViewTicketPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
			{
				path: paths.perks,
				element: <PerksPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail],
				redirectTo: paths.verifyEmail,
			},
		];

		// Admin-only routes
		const adminRoutes: RouteConfig[] = [
			{
				path: paths.admin,
				element: <AdminPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
				redirectTo: paths.home,
			},
			{
				path: paths.adminViewTicket,
				element: <AdminViewTicketPage />,
				accessCheck: [isAuthenticated, hasVerifiedEmail, isAdmin],
				redirectTo: paths.home,
			},
			{
				path: paths.adminManageEvents,
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
			if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
		};

		// Clear any existing timeout
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

		// Set timeout to turn off loading state after delay
		timeoutRef.current = window.setTimeout(() => setLoadingRoutes(false), 1500);

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
			<Router />
		</RoutesContext.Provider>
	);
};
