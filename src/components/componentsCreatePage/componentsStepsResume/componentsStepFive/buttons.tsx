import React, { ReactNode } from "react"

interface ButtonProps{
    type?: 'button' | 'submit',
    className: string,
    onClick?: () => void;
    children: ReactNode
}

const Buttons: React.FC<ButtonProps> = ({type = 'button', className, onClick, children }) => {
    return(
        <button type={type} className={className} onClick={onClick}>
            {children}
        </button>
    )
}
export default Buttons