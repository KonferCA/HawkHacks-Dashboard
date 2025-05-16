import { PageWrapper } from "@/components";
import {
	ScheduleGrid,
	ScheduleGridItem,
	type ScheduleGridItemProps,
	ScheduleRoot,
	ScheduleTabContent,
	ScheduleTabList,
	ScheduleTabTrigger,
	format12HourTime,
} from "@/components/Schedule/Schedule";
import { Box, useBreakpointValue } from "@chakra-ui/react";

interface ScheduleEntryProps extends Omit<ScheduleGridItemProps, "children"> {
	title: string;
	location: string;
}

function ScheduleEntry(props: ScheduleEntryProps) {
	return (
		<ScheduleGridItem {...props}>
			<strong>{props.title}</strong>
			<span>{props.location}</span>
			<Box textWrap="wrap">
				{format12HourTime(props.startTime)} - {format12HourTime(props.endTime)}
			</Box>
		</ScheduleGridItem>
	);
}

const schedule = [
	{
		startDate: new Date("2025-05-16T09:30:00"),
		endTime: new Date("2025-05-16T11:30:00"),
		color: "teal",
		title: "Registration",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T09:30:00"),
		endTime: new Date("2025-07-25T11:30:00"),
		color: "teal",
		title: "Registration",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:30:00"),
		endTime: new Date("2025-07-25T12:00:00"),
		color: "green",
		title: "Robotics Workshop",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T19:00:00"),
		endTime: new Date("2025-07-25T20:30:00"),
		color: "purple",
		title: "Musical Chairs",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:00:00"),
		endTime: new Date("2025-07-25T12:30:00"),
		color: "purple",
		title: "Zumba",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T14:00:00"),
		endTime: new Date("2025-07-25T15:00:00"),
		color: "red",
		title: "Sponsor",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:00:00"),
		endTime: new Date("2025-07-25T14:00:00"),
		color: "red",
		title: "Networking",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T14:00:00"),
		endTime: new Date("2025-07-25T15:30:00"),
		color: "purple",
		title: "Pictureka",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-26T09:30:00"),
		endTime: new Date("2025-07-26T11:30:00"),
		color: "teal",
		title: "Registration",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-27T09:30:00"),
		endTime: new Date("2025-07-27T11:30:00"),
		color: "teal",
		title: "Registration",
		location: "Location",
	},
];

export const SchedulePage: React.FC = () => {
	const groupedSchedule = schedule.reduce((acc, event) => {
		const entry = {
			title: event.title,
			location: event.location,
			startTime:
				`${event.startDate.getHours()}:${event.startDate.getMinutes()}` as const,
			endTime:
				`${event.endTime.getHours()}:${event.endTime.getMinutes()}` as const,
			color: event.color,
		};

		// 'YYYY-MM-DD'
		const dayKey = event.startDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		const dayMapEntry = acc.get(dayKey) ?? {
			dayDate: event.startDate,
			entries: [] as ScheduleEntryProps[],
		};

		acc.set(dayKey, dayMapEntry);
		dayMapEntry.entries.push(entry);
		return acc;
	}, new Map<string, { dayDate: Date; entries: ScheduleEntryProps[] }>());

	const scheduleEntries = Array.from(groupedSchedule.entries());

	const breakpoint = useBreakpointValue(
		{ base: "base", md: "md" },
		{ ssr: false },
	);

	return (
		<PageWrapper variant={breakpoint === "base" ? "full-height" : "default"}>
			<ScheduleRoot defaultValue={scheduleEntries[0][0]}>
				<ScheduleTabList>
					{scheduleEntries.map(([dayKey, { dayDate }]) => (
						<ScheduleTabTrigger key={dayKey} value={dayKey}>
							{breakpoint === "base"
								? // 'Saturday'
									dayDate.toLocaleDateString("en-US", {
										weekday: "long",
									})
								: // 'Saturday, July 25'
									dayDate.toLocaleDateString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
									})}
						</ScheduleTabTrigger>
					))}
				</ScheduleTabList>

				{scheduleEntries.map(([dayKey, { dayDate, entries }]) => (
					<ScheduleTabContent key={dayKey} value={dayKey}>
						<ScheduleGrid dayDate={dayDate}>
							{entries.map((entry, idx) => (
								<ScheduleEntry
									key={entry.title}
									scrollIntoViewOnMount={idx === 0}
									startTime={entry.startTime}
									endTime={entry.endTime}
									color={entry.color}
									title={entry.title}
									location={entry.location}
								/>
							))}
						</ScheduleGrid>
					</ScheduleTabContent>
				))}
			</ScheduleRoot>
		</PageWrapper>
	);
};
