import { useCallback } from "react";
import { useUser } from "@/providers";
import { getUserApplications } from "@/services/firebase/application";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApplicationsContext } from "./context";

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
        refetchOnWindowFocus: false,
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
