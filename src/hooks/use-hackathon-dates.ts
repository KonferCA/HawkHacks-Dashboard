import { getHackathonDates } from "@/services/firebase/hackathon";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook for accessing hackathon dates data
 */

const CURRENT_HACKATHON_YEAR = "2025";

export const useHackathonDates = () => {
	const queryClient = useQueryClient();

	const queryKey = ["hackathons", CURRENT_HACKATHON_YEAR];
	const { data: hackathonDates = null, isLoading } = useQuery({
		queryKey,
		queryFn: async () => {
			return await getHackathonDates(CURRENT_HACKATHON_YEAR);
		},
		enabled: !!CURRENT_HACKATHON_YEAR,
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY, // application data only really changes after a year so there is no need to refetch 
	});

	/**
	 * Invalidates and refreshes the hackathon dates query
	 */
	const refreshHackathonDates = useCallback(() => {
		return queryClient.invalidateQueries({ queryKey });
	}, [queryClient, queryKey]);

	return {
		hackathonDates: hackathonDates, 
		refreshHackathonDates,
		isLoading,
	};
};
