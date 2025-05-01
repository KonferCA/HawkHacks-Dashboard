import type { AccessControlFn } from "@/navigation/AccessControl/types";
import { Redirect } from "@/navigation/redirect";
import { paths } from "./data";

/**
 * Checks if user is authenticated (logged in)
 */
export const isAuthenticated: AccessControlFn = ({ user }) => {
	if (!user) throw new Redirect(paths.login);
	return true;
};

/**
 * Checks if user has verified their email
 */
export const hasVerifiedEmail: AccessControlFn = (ctx) => {
	if (!isAuthenticated(ctx) || !ctx.user?.emailVerified)
		throw new Redirect(paths.verifyEmail);
	return true;
};

/**
 * Checks if user is an admin
 */
export const isAdmin: AccessControlFn = (ctx) => {
	if (!isAuthenticated(ctx) || !ctx.user?.hawkAdmin)
		throw new Redirect("/not-found");
	return true;
};

/**
 * Checks if 2025 submission status is pending
 */
export const hasApplied: AccessControlFn = (ctx) => {
	if (ctx.applicationsCtx.applications.length < 1) return false;
	const app = ctx.applicationsCtx.applications.find(
		(app) => app.hackathonYear === "2025",
	);
	return app?.applicationStatus === "pending";
};

/**
 * Checks if 2025 submission status is accepted
 */
export const isAccepted: AccessControlFn = (ctx) => {
	if (!hasApplied) return false;
	const app = ctx.applicationsCtx.applications.find(
		(app) => app.hackathonYear === "2025",
	);
	return app?.applicationStatus === "accepted";
};

/**
 * Checks if hacker has RSVP'd for 2025
 */
export const hasRSVP: AccessControlFn = (ctx) => {
	if (!isAccepted(ctx)) throw new Redirect(paths.home);
	const app = ctx.applicationsCtx.applications.find(
		(app) => app.hackathonYear === "2025",
	);
	if (!app) throw new Redirect(paths.home);
	if (!app.rsvp) throw new Redirect(paths.verifyRSVP);
	return true;
};

/**
 * Checks if applications are opened or not
 */
export const isAppOpen: AccessControlFn = (ctx) =>
	ctx.applicationsCtx.deadlines.inRange;
