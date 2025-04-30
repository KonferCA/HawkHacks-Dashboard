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

interface ScheduleEntryProps extends Omit<ScheduleGridItemProps, "children"> {
	title: string;
	location: string;
}

function ScheduleEntry(props: ScheduleEntryProps) {
	return (
		<ScheduleGridItem {...props}>
			<strong>{props.title}</strong>
			<span>{props.location}</span>
			<span>
				{format12HourTime(props.startTime)} - {format12HourTime(props.endTime)}
			</span>
		</ScheduleGridItem>
	);
}

const schedule = [
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
	const groupedSchedule = schedule
		.map((event) => ({
			title: event.title,
			location: event.location,
			startTime:
				`${event.startDate.getHours()}:${event.startDate.getMinutes()}` as const,
			endTime:
				`${event.endTime.getHours()}:${event.endTime.getMinutes()}` as const,
			color: event.color,
			day: event.startDate.toLocaleDateString("en-US", {
				day: "numeric",
				month: "long",
				weekday: "long",
			}),
		}))
		.reduce((acc, entry) => {
			const dayArray = acc.get(entry.day) ?? [];
			acc.set(entry.day, dayArray);
			dayArray.push(entry);
			return acc;
		}, new Map<string, ScheduleEntryProps[]>());

	const scheduleEntries = Array.from(groupedSchedule.entries());

	return (
		<PageWrapper>
			<ScheduleRoot defaultValue={scheduleEntries[0][0]}>
				<ScheduleTabList>
					{scheduleEntries.map(([day]) => (
						<ScheduleTabTrigger key={day} value={day}>
							{day}
						</ScheduleTabTrigger>
					))}
				</ScheduleTabList>

				{scheduleEntries.map(([day, entries]) => (
					<ScheduleTabContent key={day} value={day}>
						<ScheduleGrid>
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
