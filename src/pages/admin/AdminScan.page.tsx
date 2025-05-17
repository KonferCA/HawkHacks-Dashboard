import { PageWrapper } from "@/components";
import { QRCodeScanner } from "@/components/Scanner/QRCodeScanner";
import { VideoInputDeviceSelector } from "@/components/Scanner/VideoInputDeviceSelector";
import { Alert, VStack } from "@chakra-ui/react";
import { useState } from "react";

export const AdminScanPage = () => {
	const hasMediaDevicesApi = !!navigator.mediaDevices;
	const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(
		null,
	);

	return (
		<PageWrapper>
			{hasMediaDevicesApi ? (
				<VStack gap="2" align="stretch">
					<VideoInputDeviceSelector onDeviceSelected={setSelectedDevice} />
					{selectedDevice && <QRCodeScanner deviceInfo={selectedDevice} />}
				</VStack>
			) : (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Not supported</Alert.Title>
						<Alert.Description>
							The MediaDevices API is not supported in your browser. If you are
							running the development server, MediaDevices is only available in
							secure contexts; check the project contribution guide.
						</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}
		</PageWrapper>
	);
};
