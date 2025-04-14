import { useCallback } from "react";
import { useUser } from "@/providers";
import { getUserApplications } from "@/services/firebase/application";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for accessing application data
 */
export const useApplications = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const queryKey = ["applications", user?.uid];

    const { data: applications = [], isLoading } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!user) return [];
            return await getUserApplications(user.uid);
        },
        initialData: [],
        enabled: !!user,
        refetchOnWindowFocus: false,
        staleTime: Number.POSITIVE_INFINITY, // application data only really changes after a submission so there is no need to refetch
    });

    /**
     * Invalidates and refreshes the applications query
     */
    const refreshApplications = useCallback(() => {
        return queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);

    return {
        applications,
        refreshApplications,
        isLoading,
    };
};
