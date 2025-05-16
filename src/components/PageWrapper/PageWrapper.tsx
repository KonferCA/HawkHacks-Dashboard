import { useHeaderInfo } from "@/providers";
import { Navbar } from "@components";
import { twMerge } from "tailwind-merge";

interface PageWrapperProps {
	variant?: "default" | "full-height";
	children: React.ReactNode;
}

export const PageWrapper = ({
	variant = "default",
	children,
}: PageWrapperProps) => {
	let headerInfo = useHeaderInfo() ?? {
		title: "Wow!",
		subTitle: "How did you end up here?",
	};

	if (location.pathname.startsWith("/ticket")) {
		headerInfo = {
			title: "Networking",
			subTitle: "A quick way to connect with new people at HawkHacks!",
		};
	}

	return (
		<div
			className={twMerge(
				"flex flex-col min-h-screen",
				variant === "full-height" && "h-screen",
			)}
		>
			<Navbar />

			{/* right hand side */}
			<div className="flex flex-col flex-1 min-h-0 md:pl-72">
				<div className="md:sticky top-0 z-10 shrink-0 px-6 md:py-8 py-2 border-b-2 border-b-gray-300 bg-white">
					<h1 className="text-xl md:text-4xl text-gray-800 font-bold font-sans">
						{headerInfo.title}
					</h1>
					<p className="text-md md:text-xl text-gray-500 md:mt-4 font-sans whitespace-pre-line">
						{headerInfo.subTitle}
					</p>
					<p className="text-gray-800 mt-2">
						Having trouble? Get help in our{" "}
						<a
							href="https://discord.com/invite/GxwvFEn9TB"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sky-600 font-bold underline"
						>
							Discord
						</a>{" "}
						support channel.
					</p>
				</div>
				<div
					className={twMerge(
						"flex flex-col flex-1 min-h-0",
						variant === "default" && "px-6 py-6",
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
};
