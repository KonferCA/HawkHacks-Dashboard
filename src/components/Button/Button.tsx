import { Button as ChakraButton } from "@chakra-ui/react";
import { getButtonStyles } from "./Button.styles";
import type { ButtonProps } from "./Button.type";

interface ExtendedButtonProps extends ButtonProps {
    //Adds Icon and iconPosition props to the Button component
    icon?: React.ReactNode;
    onlyIcon?: boolean;
    iconPosition?: "left" | "right";
}

export const Button: React.FC<ExtendedButtonProps> = ({
    children, 
    intent, 
    className, 
    icon, 
    onlyIcon = false, 
    iconPosition = "left",
    ...props
}) => {
    const buttonClass = getButtonStyles({ intent, className });

    return (
        <ChakraButton className={buttonClass} {...props}>
            {onlyIcon && icon}
            {!onlyIcon && iconPosition === "left" && icon}
            {!onlyIcon && children}
            {!onlyIcon && iconPosition === "right" && icon}
        </ChakraButton>
    );
};