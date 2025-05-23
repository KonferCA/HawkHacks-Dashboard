import { Alert } from "@chakra-ui/react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import type { FC } from "react";

interface InfoCalloutProps {
	text: string;
}

export const InfoCallout: FC<InfoCalloutProps> = ({ text }) => {
	return (
		<Alert.Root status="info" bg="blue.50" p={4}>
			<Alert.Indicator>
				<InformationCircleIcon
					className="h-5 w-5 text-blue-400"
					aria-hidden="true"
				/>
			</Alert.Indicator>
			<Alert.Title color="blue.600">{text}</Alert.Title>
		</Alert.Root>
	);
};
