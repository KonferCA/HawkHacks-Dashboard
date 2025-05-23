import { AppleWalletBadge, GoogleWalletBadge, LoadingDots } from "@/assets";
import { PageWrapper } from "@/components";
import { useApplications } from "@/hooks/use-applications";
import { useAuth } from "@/providers";
import { paths } from "@/providers/RoutesProvider/data";
import { logError } from "@/services/firebase/log";
import { Logo } from "@assets";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { Navigate } from "react-router-dom";

export const TicketPage = () => {
	const functions = getFunctions();
	const { currentUser } = useAuth();
	const { applications } = useApplications();
	const userApp = applications[0] || null;
	const email = currentUser?.email ?? "";
	const firstName =
		(userApp?.firstName || currentUser?.displayName?.split(" ")[0]) ??
		"Unknown";
	const lastName =
		userApp?.lastName ||
		currentUser?.displayName?.split(" ")[1] ||
		currentUser?.type ||
		"Unknown";
	const [qrCode, setQRCode] = useState<string>(LoadingDots);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const qrCodeUrl = window.localStorage.getItem("qrCodeUrl");
		if (qrCodeUrl) {
			setQRCode(qrCodeUrl);
			window.localStorage.setItem("qrCodeUrl", qrCodeUrl);
		} else if (currentUser) {
			fetchOrGenerateTicket(currentUser.uid).then((qrCodeUrl) => {
				setQRCode(qrCodeUrl);
				window.localStorage.setItem("qrCodeUrl", qrCodeUrl);
			});
		}
	}, [currentUser]);

	useEffect(() => {
		window.localStorage.setItem(paths.myTicket, "visited");
	}, []);

	const fetchOrGenerateTicket = async (userId: string): Promise<string> => {
		const fetchTicket = httpsCallable<
			{ userId: string },
			{ qrCodeUrl?: string }
		>(functions, "fetchOrGenerateTicket");
		try {
			const result = await fetchTicket({
				userId: userId,
			});
			return result.data.qrCodeUrl ?? LoadingDots;
		} catch (error) {
			console.error("Error fetching or generating ticket:", error);
			return LoadingDots;
		}
	};

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = qrCode;
		link.download = "qrcode.png";
		link.click();
	};

	if (!currentUser) return <Navigate to={paths.login} />;

	const handleCreatePassObject = async (service: "apple" | "google") => {
		setLoading(true);
		try {
			const createTicket = httpsCallable(
				functions,
				service === "apple" ? "createTicket" : "createPassObject",
			);
			const ticketResult = await createTicket({
				email: email,
				pronouns: Array.isArray(userApp?.pronouns)
					? userApp.pronouns.join(", ")
					: (userApp?.pronouns ?? "Not specified"),
			});
			const ticketData = ticketResult.data as { url: string };
			if (ticketData.url) {
				window.location.href = ticketData.url;
			} else {
				alert(
					`Ticket has been issued but could not generate ${
						service === "apple" ? "Apple Wallet" : "Google Wallet"
					} pass.`,
				);
			}
		} catch (error) {
			console.error(
				`Failed to issue ticket for ${
					service === "apple" ? "Apple Wallet" : "Google Wallet"
				}:`,
				error,
			);
			logError(error as Error, `create_${service}_wallet_ticket_error`);
		}
		setLoading(false);
	};

	return (
		<PageWrapper>
			<div className="flex justify-start">
				<div className="bg-white drop-shadow-xl rounded-xl box-border max-w-[400px] w-full p-8 flex flex-col gap-2">
					<div className="flex items-center font-bold text-2xl md:text-[30px]">
						<img src={Logo} alt="HawkHacks Logo" className="w-6 mr-2" />
						HawkHacks 2024
					</div>
					<div className="flex flex-col gap-2 mt-2">
						<h1 className="font-semibold text-3xl md:text-[42px]">
							{firstName} {lastName}
						</h1>
						<h2 className="text-gray-500 underline truncate">{email}</h2>
					</div>
					<div className="bg-gray-200 rounded-xl h-[2px]" />
					<div className="flex flex-col items-center">
						<img src={qrCode} alt="QR Code" className="w-full" />
						<button
							type="button"
							className="text-3xl mb-4"
							onClick={handleDownload}
						>
							<FiDownload />
						</button>
						<div className="flex w-full justify-evenly items-center">
							<button
								type="button"
								onClick={() => {
									handleCreatePassObject("apple");
								}}
								style={{
									display: "inline-block",
									width: "40%",
								}}
							>
								<img
									src={AppleWalletBadge}
									alt="Add to Apple Wallet"
									style={{ width: "100%", height: "auto" }}
								/>
							</button>
							<button
								type="button"
								onClick={() => {
									handleCreatePassObject("google");
								}}
								style={{
									display: "inline-block",
									width: "45%",
								}}
							>
								<img src={GoogleWalletBadge} alt="Add to Google Wallet" />
							</button>
						</div>
					</div>
					{loading && (
						<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 flex justify-center items-center rounded-xl">
							<img src={LoadingDots} alt="Loading..." />
						</div>
					)}
				</div>
			</div>
		</PageWrapper>
	);
};
