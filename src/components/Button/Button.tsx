import { Button as ChakraButton } from "@chakra-ui/react";
import { getButtonStyles } from "./Button.styles";
import type { ButtonProps } from "./Button.type";


export const Button: React.FC<ButtonProps> = ({
    children, 
    intent, 
    className, 
    ...props
}) => {
    const buttonClass = getButtonStyles({ intent, className });

    return (
        <ChakraButton className={buttonClass} {...props}>
            {children}
        </ChakraButton>
    );
};