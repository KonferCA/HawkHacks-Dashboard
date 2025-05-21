import { useApplications } from "@/hooks/use-applications";
import type { AccessControlFn } from "@/navigation/AccessControl/types";

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

/**
 * Checks if user is a hacker
 */
export const isHacker: AccessControlFn = ({ user }) => user?.type === "hacker";

/**
 * Checks if user is a Tier 1 Volunteer
 */
export const isVolunteerT1: AccessControlFn = ({ user }) =>
    user?.type === "volunteer.t1";

/**
 * Checks if user is a Tier 2 Volunteer
 */
export const isVolunteerT2: AccessControlFn = ({ user }) =>
    user?.type === "volunteer.t2";

/**
 * Checks if user is a sponsor
 */
export const isSponsor: AccessControlFn = ({ user }) =>
    user?.type === "sponsor";

/**
 * Checks if user is a mentor
 */
export const isMentor: AccessControlFn = ({ user }) => user?.type === "mentor";

/**
 * Checks if user is a VIP
 */
export const isVIP: AccessControlFn = ({ user }) => user?.type === "vip";

/**
 * Checks if user is a speaker
 */
export const isSpeaker: AccessControlFn = ({ user }) =>
    user?.type === "speaker";

/**
 * Checks if user has RSVP verified
 */
export const isRSVPVerified: AccessControlFn = ({ user }) =>
    !!user?.rsvpVerified;

/**
 * Checks if user's application is accepted
 */
export const applicationAccepted: AccessControlFn = () => {
    const { mostRecentApplication } = useApplications();
    return mostRecentApplication?.applicationStatus === "accepted" && mostRecentApplication?.accepted === true;
};

/**
 * Checks if user's application is rejected
 */
export const applicationRejected: AccessControlFn = () => {
    const { mostRecentApplication } = useApplications();
    return mostRecentApplication?.applicationStatus === "rejected" && mostRecentApplication?.accepted === false;
};

/** 
 * Checks if application is pending
 */
export const applicationPending: AccessControlFn = () => {
    const { mostRecentApplication } = useApplications();
    return mostRecentApplication?.applicationStatus === "pending" && mostRecentApplication?.accepted === false;
};

