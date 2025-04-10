import type { ApplicationData } from "@/components/forms/types";

/**
 * Context value for the applications provider
 */
export interface ApplicationsContextValue {
    /** List of user's application data */
    applications: ApplicationData[];
    /** Function to refresh applications data */
    refreshApplications: () => void;
    /** Loading state of applications data */
    isLoading: boolean;
}
