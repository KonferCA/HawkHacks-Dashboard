/*


This component is a wrapper around Chakra UI's Button component.
Therefore, it can be depreciated and all instances of a Button can be directly 
use Chakra UI's Button component.




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
*/