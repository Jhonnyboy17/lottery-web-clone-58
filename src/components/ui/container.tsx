
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ 
  className = "", 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={`container mx-auto ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
