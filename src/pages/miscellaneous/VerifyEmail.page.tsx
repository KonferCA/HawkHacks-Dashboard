import { PageWrapper } from "@/components";
import { useAuth } from "@/providers";
import { paths } from "@/providers/RoutesProvider/data";
import { auth } from "@/services/firebase";
import { Button } from "@chakra-ui/react";
import { sendEmailVerification } from "firebase/auth";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

export const VerifyEmailPage = () => {
	// 60 seconds timeout before the user can send the next email verification
	const [resendSeconds, setResendSeconds] = useState(0);
	// -9999 random number to init the ref, this will hold the id for the time interval
	const resendEmailCountdownRef = useRef<number>(-9999);
	const { logout, reloadUser, currentUser } = useAuth();

	const startCountdown = () => {
		resendEmailCountdownRef.current = window.setInterval(() => {
			setResendSeconds((seconds) => {
				if (seconds > 0) {
					return seconds - 1;
				}
				window.clearInterval(resendEmailCountdownRef.current);
				return 0;
			});
		}, 1000);
	};

	if (currentUser?.emailVerified) return <Navigate to={paths.home} />;

	return (
		<PageWrapper>
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="">
					<p className="text-2xl">One more step!</p>
					<p className="mt-4 text-xl text-gray-700">
						Once you have verified your email, please click on the{" "}
						<span className="text-tbrand font-semibold">Check Email</span>{" "}
						button.
					</p>
					<p className="mt-4 text-xl text-gray-700">
						Account Email:
						<span className="ml-2 text-tbrand font-semibold">
							{currentUser?.email ? currentUser.email : "N/A"}
						</span>
					</p>
					{/* TODO: button is here for dev, should be taken away once side navbar is completed */}
					<Button className="mt-4" onClick={logout}>
						Log Out
					</Button>
				</div>
				<div className="mt-12 sm:flex gap-4">
					<div className="space-x-4">
						<Button
							onClick={() => {
								if (resendSeconds <= 0 && auth.currentUser) {
									sendEmailVerification(auth.currentUser);
									setResendSeconds(60);
									startCountdown();
								}
							}}
							disabled={resendSeconds > 0}
						>
							{resendSeconds <= 0
								? "Resend Email Verification"
								: `${resendSeconds}s Left Before Resend`}
						</Button>
						<Button onClick={reloadUser}>Check Email</Button>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};
