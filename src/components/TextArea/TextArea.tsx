import {
	type TextInputStylesProps,
	getTextInputDescriptionStyles,
	getTextInputLabelStyles,
	getTextInputStyles,
} from "@/components/TextInput/TextInput.styles";
import { Textarea, type TextareaProps } from "@chakra-ui/react";

interface Props
	extends TextInputStylesProps,
		React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/**
	 * Label text of the input. For accessibility reasons, all inputs should have a label.
	 */
	label: string;

	/**
	 * Make input label screen-reader only. Default false.
	 */
	srLabel?: boolean;

	/**
	 * Force the usage of id to match label to input.
	 * This avoids dynamically generating a new id in runtime.
	 */
	id: string;

	/**
	 * Description of the input field.
	 */
	description?: string;
}

export type TextAreaProps = Props & TextareaProps;

export const TextArea: React.FC<TextAreaProps> = ({
	label,
	className,
	invalid,
	description,
	srLabel = false,
	required,
	...textAreaProps
}) => {
	const describedby = `text-input-description-${textAreaProps.id}`;
	return (
		<div>
			<label
				htmlFor={textAreaProps.id}
				className={getTextInputLabelStyles({ srLabel })}
			>
				{label}
				{required ? <span className="text-red-600 ml-1">*</span> : null}
			</label>
			<div className="mt-2">
				<Textarea
					{...textAreaProps}
					aria-describedby={[
						textAreaProps["aria-describedby"] ?? "",
						describedby,
					].join(" ")}
					className={getTextInputStyles({ invalid, className })}
				/>
			</div>
			{description && (
				<p
					className={getTextInputDescriptionStyles({ invalid })}
					id={describedby}
				>
					{description}
				</p>
			)}
		</div>
	);
};
