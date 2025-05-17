import { Alert } from "@chakra-ui/react";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";

interface QRCodeScannerProps {
	deviceInfo: MediaDeviceInfo;
}

let lastInitPromise = Promise.resolve();

export function QRCodeScanner(props: QRCodeScannerProps) {
	const videoPreviewRef = useRef<HTMLVideoElement>(null);
	const [decodedText, setDecodedText] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		function onDecode(result: { getText(): string } | undefined) {
			if (!result) return;
			setDecodedText((prevDecodedText) => {
				// Ensure modal is closed before decoding a new QR code
				if (prevDecodedText !== null) return prevDecodedText;
				return result.getText();
			});
		}

		const abortController = new AbortController();

		async function init() {
			if (!videoPreviewRef.current) return;
			if (abortController.signal.aborted) return;

			const codeReader = new BrowserQRCodeReader();
			let controls: IScannerControls;
			try {
				controls = await codeReader.decodeFromVideoDevice(
					props.deviceInfo.deviceId,
					videoPreviewRef.current,
					onDecode,
				);
			} catch (error) {
				if (abortController.signal.aborted) return;
				const message =
					error instanceof Error
						? error.message
						: "An unknown error occurred while starting the QR code scanner";
				setError(message);
				return;
			}

			if (abortController.signal.aborted) {
				controls.stop();
				return;
			}
			abortController.signal.addEventListener("abort", () => controls.stop());
			setError(null);
		}

		// Wait for the previous init promise to resolve before starting a new one
		// as the scanner must clean up before starting a new one
		lastInitPromise = lastInitPromise.then(init);
		return () => {
			abortController.abort();
		};
	}, [props.deviceInfo]);

	return (
		<div>
			{error && (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}
			{/* biome-ignore lint/a11y/useMediaCaption: it's a live feed not a video */}
			<video ref={videoPreviewRef} />
			{decodedText && (
				<Modal
					title="QR Code Scanned"
					subTitle=""
					open={!!decodedText}
					onClose={() => setDecodedText(null)}
				>
					{decodedText}
				</Modal>
			)}
		</div>
	);
}
