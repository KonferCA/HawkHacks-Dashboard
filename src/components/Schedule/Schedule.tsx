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

export function ScheduleGrid(props: ScheduleGridProps) {
	return (
		<Box w="100%" overflowX="auto" overflowY="hidden">
			<Grid
				width="2800px"
				templateColumns="repeat(48, 1fr)"
				gap="4px"
				m={4}
				position="relative"
			>
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
				<ScheduleTimeIndicator>12:00 AM</ScheduleTimeIndicator>
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
		<GridItem colSpan={2} h="32px">
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
			gap="99px" // grid item height + grid gap - grid line border height
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
	color: "blue" | "teal" | "red" | "green" | "purple" | "orange" | "pink";
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

type HourType =
	`${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23}`;
type MinuteType = "00" | "30";
type TimeType = `${HourType}:${MinuteType}`;

function scheduleColumnHelper(time: TimeType): number {
	const [hour, minute] = time.split(":").map(Number);
	const colStart = hour * 2 - 1 + (minute === 30 ? 1 : 0);
	return colStart;
}

export function format12HourTime(time: TimeType): string {
	const [hour, minute] = time.split(":").map(Number);
	const period = hour >= 12 ? "PM" : "AM";
	const formattedHour = hour % 12 || 12; // Convert to 12-hour format
	const formattedMinute = minute.toString().padStart(2, "0");
	return `${formattedHour}:${formattedMinute} ${period}`;
}
