import { PageWrapper } from "@/components";
import {
	ScheduleTabContent,
	ScheduleRoot,
	ScheduleTabList,
	ScheduleTabTrigger,
	ScheduleGrid,
	ScheduleGridItem,
	ScheduleGridItemProps,
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

export const SchedulePage: React.FC = () => {
	return (
		<PageWrapper>
			<ScheduleRoot defaultValue="day1">
				<ScheduleTabList>
					<ScheduleTabTrigger value="day1">Day 1</ScheduleTabTrigger>
					<ScheduleTabTrigger value="day2">Day 2</ScheduleTabTrigger>
					<ScheduleTabTrigger value="day3">Day 3</ScheduleTabTrigger>
				</ScheduleTabList>

				<ScheduleTabContent value="day1">
					<ScheduleGrid>
						<ScheduleEntry
							scrollIntoViewOnMount
							startTime="9:30"
							endTime="11:30"
							color="teal"
							title="Registration"
							location="Location"
						/>
						<ScheduleEntry
							startTime="11:30"
							endTime="12:00"
							color="green"
							title="Robotics Workshop"
							location="Location"
						/>
						<ScheduleEntry
							startTime="19:00"
							endTime="20:30"
							color="purple"
							title="Musical Chairs"
							location="Location"
						/>
						<ScheduleEntry
							startTime="11:00"
							endTime="12:30"
							color="purple"
							title="Zumba"
							location="Location"
						/>
						<ScheduleEntry
							startTime="14:00"
							endTime="15:00"
							color="red"
							title="Sponsor"
							location="Location"
						/>
						<ScheduleEntry
							startTime="11:00"
							endTime="14:00"
							color="red"
							title="Networking"
							location="Location"
						/>
						<ScheduleEntry
							startTime="14:00"
							endTime="15:30"
							color="purple"
							title="Pictureka"
							location="Location"
						/>
					</ScheduleGrid>
				</ScheduleTabContent>

				<ScheduleTabContent value="day2">
					<ScheduleGrid>
						<ScheduleEntry
							scrollIntoViewOnMount
							startTime="9:30"
							endTime="11:30"
							color="teal"
							title="Registration"
							location="Location"
						/>
					</ScheduleGrid>
				</ScheduleTabContent>

				<ScheduleTabContent value="day3">
					<ScheduleGrid>
						<ScheduleEntry
							scrollIntoViewOnMount
							startTime="9:30"
							endTime="11:30"
							color="teal"
							title="Registration"
							location="Location"
						/>
					</ScheduleGrid>
				</ScheduleTabContent>
			</ScheduleRoot>
		</PageWrapper>
	);
};
