import type { AccessControlFn } from "@/navigation/AccessControl/AccessControl.types";

/**
 * Checks if user is authenticated (logged in)
 */
export const isAuthenticated: AccessControlFn = ({ user }) => !!user;

/**
 * Checks if user has verified their email
 */
export const hasVerifiedEmail: AccessControlFn = ({ user }) =>
    !!user && user.emailVerified;

/**
 * Checks if user is an admin
 */
export const isAdmin: AccessControlFn = ({ user }) => !!user && user.hawkAdmin;
