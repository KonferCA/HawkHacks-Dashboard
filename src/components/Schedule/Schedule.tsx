import { Box, Grid, GridItem, Tabs } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface ScheduleRootProps {
	defaultValue?: string;
	children: React.ReactNode;
}

export function ScheduleRoot(props: ScheduleRootProps) {
	return <Tabs.Root lazyMount {...props} />;
}

export function ScheduleTabList(props: React.PropsWithChildren) {
	return <Tabs.List display="flex" {...props} />;
}

interface ScheduleTabTriggerProps {
	value: string;
	children: React.ReactNode;
}

export function ScheduleTabTrigger(props: ScheduleTabTriggerProps) {
	return (
		<Tabs.Trigger flex="1" display="flex" justifyContent="center" {...props} />
	);
}

interface ScheduleContentProps {
	value: string;
	children: React.ReactNode;
}

export function ScheduleTabContent(props: ScheduleContentProps) {
	return <Tabs.Content {...props} />;
}

interface ScheduleGridProps {
	children: React.ReactNode;
}

// The schedule grid is 24 hours long, from 12:00 AM to 12:00 AM the next day
// Each hour is divided into 60 minutes, so there are 24*60=1440 columns in total
export function ScheduleGrid(props: ScheduleGridProps) {
	return (
		<Box w="100%" overflowX="auto" overflowY="hidden">
			<Grid
				width="2800px"
				templateColumns="repeat(1440, 1fr)"
				m={4}
				position="relative"
			>
				<ScheduleTimeIndicator>12:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>1:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>2:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>3:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>4:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>5:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>6:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>7:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>8:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>9:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>10:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>11:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>12:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>1:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>2:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>3:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>4:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>5:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>6:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>7:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>8:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>9:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>10:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>11:00 PM</ScheduleTimeIndicator>
				<ScheduleGridLineContainer>
					{Array.from({ length: 24 }, (_, i) => (
						<ScheduleGridLine key={i} />
					))}
				</ScheduleGridLineContainer>
				{props.children}
			</Grid>
		</Box>
	);
}

function ScheduleTimeIndicator({ children }: { children: React.ReactNode }) {
	return (
		<GridItem h="32px" colSpan={60}>
			{children}
		</GridItem>
	);
}

export function ScheduleGridLineContainer(props: React.PropsWithChildren) {
	return (
		<Box
			position="absolute"
			w="100%"
			top="36px" // time indicator height + grid gap
			display="flex"
			flexDir="column"
			gap="99px" // grid item height + grid item padding top - grid line border height
			zIndex={-1}
			{...props}
		/>
	);
}

export function ScheduleGridLine() {
	return <Box width="100%" borderTopWidth="1px" borderColor="gray.subtle" />;
}

export interface ScheduleGridItemProps {
	scrollIntoViewOnMount?: boolean;
	startTime: TimeType;
	endTime: TimeType;
	color: string;
	children: React.ReactNode;
}

export function ScheduleGridItem({
	scrollIntoViewOnMount = false,
	startTime,
	endTime,
	color = "teal",
	children,
}: ScheduleGridItemProps) {
	const itemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollIntoViewOnMount && itemRef.current) {
			itemRef.current.scrollIntoView({
				behavior: "instant",
				inline: "start",
			});
		}
	}, [scrollIntoViewOnMount]);

	return (
		<GridItem
			ref={itemRef}
			colStart={scheduleColumnHelper(startTime)}
			colEnd={scheduleColumnHelper(endTime)}
			mt="4px"
			mr="4px"
			color={`${color}.contrast`}
			bg={`${color}.fg`}
			borderRadius="md"
			p={2}
			fontSize="sm"
			display="flex"
			flexDir="column"
			scrollMargin={8}
			height="96px"
			textWrap="nowrap"
			overflowX="hidden"
			textOverflow="ellipsis"
		>
			{children}
		</GridItem>
	);
}

type TimeType = `${number}:${number}`;

function scheduleColumnHelper(time: TimeType): number {
	const [hour, minute] = time.split(":").map(Number);
	const col = hour * 60 + minute;
	return col + 1; // CSS Grid is 1-indexed
}

export function format12HourTime(time: TimeType): string {
	const [hour, minute] = time.split(":").map(Number);
	const period = hour >= 12 ? "PM" : "AM";
	const formattedHour = hour % 12 || 12; // Convert to 12-hour format
	const formattedMinute = minute.toString().padStart(2, "0");
	return `${formattedHour}:${formattedMinute} ${period}`;
}
