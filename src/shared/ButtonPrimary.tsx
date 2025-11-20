/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button, ButtonProps } from './Button'

const ButtonPrimary: React.FC<ButtonProps> = ({ color, outline, plain, children, ...props }) => {
  return (
    <Button color="dark/white" {...props}>
      {children}
    </Button>
  )
}

export default ButtonPrimary
