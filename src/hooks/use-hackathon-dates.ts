import { getHackathonDates } from "@/services/firebase/hackathon";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface HackathonDates {
	year: string;
	dates: {
		start: string;
		end: string;
	};
}

/**
 * Hook for accessing application data
 */
export const useHackathonDates = (year: string) => {
	const queryClient = useQueryClient();

	const queryKey = ["hackathon-dates", year];
	    const { data: hackathonDates = {}, isLoading } = useQuery({
		queryKey,
		queryFn: async () => {
			return await getHackathonDates(year);
		},
		enabled: !!year,
		refetchOnWindowFocus: false,
		staleTime: Number.POSITIVE_INFINITY, // application data only really changes after a year so there is no need to refetch 
	});

	/**
	 * Invalidates and refreshes the applications query
	 */
	const refreshApplications = useCallback(() => {
		return queryClient.invalidateQueries({ queryKey });
	}, [queryClient, queryKey]);

	return {
		dates: hackathonDates,
		refreshApplications,
		isLoading,
	};
};
