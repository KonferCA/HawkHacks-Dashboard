import { Logo } from "@/assets";
import { useApplications } from "@/hooks/use-applications";
import { useAuth } from "@/providers";
import { useRouteDefinitions, useUser } from "@/providers";
import { paths } from "@/providers/RoutesProvider/data";
import {
	CalendarDaysIcon,
	CodeBracketIcon,
	HomeIcon,
	ShareIcon,
	TicketIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
	CalendarDaysIcon as CalendarDaysIconSolid,
	CodeBracketIcon as CodeBracketIconSolid,
	HomeIcon as HomeIconSolid,
	ShareIcon as ShareIconSolid,
	TicketIcon as TicketIconSolid,
	UserGroupIcon as UserGroupIconSolid,
} from "@heroicons/react/24/solid";
import Hamburger from "hamburger-react";
import { useEffect, useMemo, useState } from "react";
import { FiLogOut, FiMapPin } from "react-icons/fi";
import { RiDiscordLine } from "react-icons/ri";
import { RxStar, RxStarFilled } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
	const { logout } = useAuth();

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { user } = useUser();
	const { applications } = useApplications();
	const routes = useRouteDefinitions();

	const availableRoutes = useMemo(() => {
		return routes.filter((route) => {
			// Default to include in navbar if no access check defined
			if (typeof route.accessCheck === "undefined") return true;
			if (typeof route.accessCheck === "function")
				return route.accessCheck({ user, applications });
			if (Array.isArray(route.accessCheck))
				return route.accessCheck.every((check) =>
					check({ user, applications }),
				);
			// Default to exclude if access check type is not recognized
			return false;
		});
	}, [routes, user, applications]);

	const navItems = {
		[paths.home]: {
			label: "Home",
			Icon: HomeIcon,
			ActiveIcon: HomeIconSolid,
		},
		[paths.schedule]: {
			label: "Schedule",
			Icon: CalendarDaysIcon,
			ActiveIcon: CalendarDaysIconSolid,
		},
		[paths.networking]: {
			label: "Networking",
			Icon: ShareIcon,
			ActiveIcon: ShareIconSolid,
		},
		[paths.myTicket]: {
			label: "My Ticket",
			Icon: TicketIcon,
			ActiveIcon: TicketIconSolid,
		},
		[paths.application]: {
			label: "Application",
			Icon: CodeBracketIcon,
			ActiveIcon: CodeBracketIconSolid,
		},
		[paths.myTeam]: {
			label: "My Team",
			Icon: UserGroupIcon,
			ActiveIcon: UserGroupIconSolid,
		},
		[paths.perks]: {
			label: "Perks",
			Icon: RxStar,
			ActiveIcon: RxStarFilled,
		},
	};

	const location = useLocation();

	const updateNavbarState = () => {
		setIsMobile(window.innerWidth <= 768);
	};

	const firstName =
		applications[0]?.firstName || user?.displayName?.split(" ")[0] || "Unknown";

	useEffect(() => {
		window.addEventListener("resize", updateNavbarState);
		return () => {
			window.removeEventListener("resize", updateNavbarState);
		};
	}, []);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location]);

	// TODO: groom routes rendering

	const renderNavItems = (isMobile: boolean) => {
		return availableRoutes
			.filter(({ path }) => !!navItems[path as string])
			.map(({ path }) => {
				const { label, Icon, ActiveIcon } = navItems[path as string];
				const isActive = location.pathname === path;
				if (
					(path === paths.myTeam && !window.localStorage.getItem(path)) ||
					(path === paths.myTicket && !window.localStorage.getItem(path)) ||
					(path === paths.perks && !window.localStorage.getItem(path))
				) {
					return (
						<Link key={label} to={path as string} className="relative w-full">
							<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
								{isMobile ? (
									<>
										<Icon className="w-3 h-3" />
										<span className="relative">
											{label}
											<span className="absolute flex h-2 w-2 top-0 right-0 translate-x-full">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
												<span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
											</span>
										</span>
									</>
								) : (
									<>
										{isActive ? (
											<ActiveIcon className="w-5 h-5" />
										) : (
											<Icon className="w-5 h-5" />
										)}
										<span className="relative hidden md:flex">
											{label} {/* my team and perks */}
											<span className="absolute flex h-2 w-2 top-0 right-0 translate-x-full">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
												<span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
											</span>
										</span>
									</>
								)}
							</li>
						</Link>
					);
				}

				return (
					<Link key={label} to={path as string} className="w-full">
						<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
							{isMobile ? (
								<>
									<Icon className="w-3 h-3" />
									<span>{label}</span>
								</>
							) : (
								<>
									{isActive ? (
										<ActiveIcon className="w-5 h-5" />
									) : (
										<Icon className="w-5 h-5" />
									)}
									<span className="hidden md:flex">
										{label} {/* everything else */}
									</span>
								</>
							)}
						</li>
					</Link>
				);
			});
	};

	return (
		<>
			{isMobile ? (
				<>
					<nav className="flex items-center justify-between p-4 text-white border-b-2 border-b-gray-300">
						<div className="flex items-center justify-start">
							<Link className="flex gap-4 items-center z-10" to="/profile">
								<img className="h-10 w-10" src={Logo} alt="HawkHacks Logo" />
							</Link>
						</div>
						<div>
							<Hamburger
								toggled={isMobileMenuOpen}
								toggle={setMobileMenuOpen}
								size={24}
								color="black"
								label="Show navigation menu"
							/>
						</div>
					</nav>

					<div
						className={`fixed z-20 right-0 top-0 h-full max-w-full p-10 py-24 bg-gray-200 backdrop-blur-xl transition-all duration-300 ease-in-out ${
							isMobileMenuOpen
								? "translate-x-0 opacity-100"
								: "translate-x-full opacity-0"
						}`}
					>
						<div className="absolute right-2 top-2">
							<Hamburger
								toggled={isMobileMenuOpen}
								toggle={setMobileMenuOpen}
								size={24}
								color="black"
								label="Show navigation menu"
							/>
						</div>
						<ul className="flex flex-col items-start justify-start divide-y divide-charcoalBlack">
							{user &&
								(user.type === "mentor" ||
									user.type === "volunteer" ||
									(user.type === "hacker" && user.rsvpVerified))}

							<a
								href="https://maps.app.goo.gl/Fxic5XJBzZjHP4Yt5"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
									Location
								</li>
							</a>
							{user && renderNavItems(true)}
							<a
								href="https://discord.com/invite/GxwvFEn9TB"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
									Discord Support
								</li>
							</a>
						</ul>

						{user && (
							<button
								className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
								type="button"
								onClick={logout}
							>
								Sign out
							</button>
						)}
					</div>
				</>
			) : (
				<nav
					className={
						"h-screen p-4 bg-white transition-all duration-300 gap-12 flex-col w-[60px] font-medium text-cadetBlue hidden md:block md:fixed md:inset-y-0 md:z-10 md:w-72 border-r-2 border-r-gray-300"
					}
				>
					<div className="flex items-start justify-start p-4">
						<Link
							className="flex gap-4 items-center justify-start"
							to={paths.home}
						>
							<img className="h-10 w-10" src={Logo} alt="HawkHacks Logo" />
							<span className="hidden md:flex text-2xl font-bold text-black">
								HawkHacks
							</span>
						</Link>
					</div>

					<div className="flex items-left justify-left p-4">
						Welcome, <span className="ml-1 font-bold"> {firstName} </span> !
					</div>

					<aside className="flex flex-col items-start justify-between h-[83%] overflow-y-auto">
						<ul className="flex flex-col items-start justify-start gap-4 w-full">
							{user &&
								(user.type === "mentor" ||
									user.type === "volunteer" ||
									(user.type === "hacker" && user.rsvpVerified))}
							<a
								href="https://maps.app.goo.gl/Fxic5XJBzZjHP4Yt5"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
									<FiMapPin className="w-5 h-5" />
									Location
								</li>
							</a>
							{user && renderNavItems(false)}
							<a
								href="https://discord.com/invite/GxwvFEn9TB"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
									<RiDiscordLine className="w-5 h-5" />
									Discord Support
								</li>
							</a>
						</ul>
						{user && (
							<button
								className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
								type="button"
								onClick={logout}
							>
								<FiLogOut className="w-5 h-5" />
								<span className="hidden md:flex">Sign out</span>
							</button>
						)}
					</aside>
				</nav>
			)}
		</>
	);
};
