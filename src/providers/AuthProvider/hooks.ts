import { useContext } from "react";
import { AuthContext } from "./context";

export const useAuth = () => useContext(AuthContext);

export const useUser = () => {
	const ctx = useContext(AuthContext);
	const user = ctx.currentUser;
	return {
		user: user,
		role: {
			isHacker: user?.type === "hacker",
			isVolunteer: user?.type === "volunteer",
			isMentor: user?.type === "mentor",
			isSponsor: user?.type === "sponsor",
			isSpeaker: user?.type === "speaker",
			isGuest: user?.type === "guest",
		},
	};
};
