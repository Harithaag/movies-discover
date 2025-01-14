import React, { useContext } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { ThemeContext } from "context/ThemeContext";

interface CommonTypographyProps extends TypographyProps {
    children: React.ReactNode;
}

const CommonTypography: React.FC<CommonTypographyProps> = ({
    children,
    ...props
}) => {
    const { theme } = useContext(ThemeContext);
    return (
        <Typography {...props} sx={{ color: theme === "dark" ? "white" : "black", ...props.sx }}>
            {children}
        </Typography>
    );
};

export default CommonTypography;
