import { createContext, useContext, useCallback } from "react";
import { useUser } from "./auth.provider";
import { getUserApplications } from "@/services/firebase/application";
import type { ApplicationData } from "@/components/forms/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Context value for the applications provider
 */
interface ApplicationsContextValue {
    /** List of user's application data */
    applications: ApplicationData[];
    /** Function to refresh applications data */
    refreshApplications: () => void;
    /** Loading state of applications data */
    isLoading: boolean;
}

/**
 * Context for managing application data
 */
const ApplicationsContext = createContext<ApplicationsContextValue>({
    applications: [],
    refreshApplications: async () => {},
    isLoading: false,
});

/**
 * Provider component for managing application data
 */
export const ApplicationsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const user = useUser();
    const queryClient = useQueryClient();
    const { data: applications, isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: async () => {
            if (!user) return [];
            return await getUserApplications(user.uid);
        },
        initialData: [],
        enabled: !!user,
    });

    /**
     * Invalidates and refreshes the applications query
     */
    const refreshApplications = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
    }, [user, queryClient]);

    return (
        <ApplicationsContext.Provider
            value={{
                applications,
                refreshApplications,
                isLoading,
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    );
};

/**
 * Hook for accessing application data
 */
export const useApplications = () => {
    return useContext(ApplicationsContext);
};
