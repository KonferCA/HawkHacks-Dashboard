import { EventNameString } from "firebase/analytics";
import { type FC, type ReactNode, useEffect, useState } from "react";

// EventType represents the different types of events available.
// These are used to decide the colour of each event that is rendered on screen.
export enum EventType {
	WORKSHOP = 0,
	EVENT = 1,
	FOOD = 2,
	IMPORTANT = 3,
	GAME_CHILL = 4,
	NETWORKING = 5,
}

// EventItem represents an event that is going to be rendered
export interface EventItem {
	// unique event id
	id: string;
	// ISO-8601 format
	startsAt: string;
	// ISO-8601 format
	endsAt: string;

	// basic information
	title: string;
	description: string;

	// optional icon that appears on the far left of an event card
	icon?: ReactNode;

	// actions
	onClick?: ((evt: EventItem) => void) | ((evt: EventItem) => Promise<void>);
}

export interface ScheduleProps {
	events: EventItem[];
}

/*
 * Main idea is to have the schedule component expand the entire width of the given parent container.
 * The component should handle responsiveness and the parent container is responsible of putting it
 * somewhere in the page. When an event is clicked, the component bubbles up an onClick so that
 * the parent component that handle the event and do something with the clicked event.
 *
 * The dates have to be strictly in iso-8601 format so that ordering isn't messed up.
 * All dates have to be strictly in UTC and UTC only.
 * Dates are converted into the local timezone from UTC.
 *
 *
 * UI:
 * Events are stacked on the Y-axis and time is on the X-axis (desktop)
 *
 * Single column, multi row in mobile, events are ordered by time,
 * different days switch by selecting on the header (mobile)
 *
 */
const Schedule: FC<ScheduleProps> = ({ events }) => {
	const [sortedEvents, setSortedEvents] = useState<EventItem[]>([]);

	// sort the events
	useEffect(() => {}, [events]);

	return <div />;
};

export { Schedule };
