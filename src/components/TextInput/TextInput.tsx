import {
    type TextInputStylesProps,
    getTextInputLabelStyles,
    getTextInputStyles,
    getTextInputDescriptionStyles,
} from "./TextInput.styles";
import React, { useState } from 'react';
import { Input, Field, Box, } from "@chakra-ui/react";

export interface TextInputProps
    extends TextInputStylesProps,
    // Omit default Size property in HTMLInputElement as it expects a number not a value of either "sm" | "md" | "lg" | "xl" | "2xl" | "2xs" 
        Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { 
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
     * Size of the input field as required by ChakaraUI
     * Defaults to md if no input is given
     */

    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "2xs";

    /**
     * Description of the input field.
     */
    description?: string;

    /**
     * Function to validate the input value.
     */
    validate?: (value: string) => boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    className,
    invalid,
    description,
    size = "md",
    srLabel = false,
    required,
    validate,
    ...inputProps
}) => {
    const describedby = `text-input-description-${inputProps.id}`;
    const [error, setError] = useState<string | null>(null);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (validate && !validate(event.target.value)) {
            setError("Invalid URL format.");
        } else {
            setError(null);
        }
    };

    return (
        <Field.Root unstyled >
            <Field.Label
                htmlFor={inputProps.id}
                className={getTextInputLabelStyles({ srLabel })}
            >
                {label}
                {required ? <span className="text-red-600 ml-1">*</span> : null}
            </Field.Label>
            <Box className="mt-2">
                <Input
                    {...inputProps}
                    size={size}  
                    aria-describedby={[
                        inputProps["aria-describedby"] ?? "",
                        describedby,
                    ].join(" ")}
                    className={getTextInputStyles({ invalid, className })}
                    onBlur={handleBlur}
                />
            </Box>
            {error && (
                <Field.ErrorText className="text-red-500 text-sm mt-1">{error}</Field.ErrorText>
            )}
            {description && (
                <Field.HelperText
                    className={getTextInputDescriptionStyles({ invalid })}
                    id={describedby}
                >
                    {description}
                </Field.HelperText>
            )}
        </Field.Root>
        
    );
};
