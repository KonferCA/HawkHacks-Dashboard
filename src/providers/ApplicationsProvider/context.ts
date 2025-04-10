import { createContext } from "react";
import type { ApplicationsContextValue } from "@/providers/ApplicationsProvider/types";

/**
 * Context for managing application data
 */
export const ApplicationsContext = createContext<ApplicationsContextValue>({
    applications: [],
    refreshApplications: async () => {},
    isLoading: false,
});
