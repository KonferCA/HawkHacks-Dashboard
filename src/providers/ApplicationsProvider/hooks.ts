import { useContext } from "react";
import { ApplicationsContext } from "@/providers/ApplicationsProvider/context";

/**
 * Hook for accessing application data
 */
export const useApplications = () => {
    return useContext(ApplicationsContext);
};
