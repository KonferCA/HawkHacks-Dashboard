import type { HeaderInfo, PathObject } from "./types";

/**
 * Centralized definition of all application paths
 */
export const paths: PathObject = {
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
export const titles: Record<string, HeaderInfo> = {
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
