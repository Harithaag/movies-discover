import React, { useContext } from "react";
import { AppBar, Toolbar, Box, Button, Switch, FormControlLabel } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import CommonTypography from "./common/CommonTypography";

const Header: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <AppBar position="fixed" sx={{ backgroundColor: theme === "dark" ? "#1c1c1c" : "#f5f5f5" }}>
            <Toolbar>
                <CommonTypography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: "bold",
                    }}
                >
                    Movie Discover
                </CommonTypography>
                <Box>
                    <Button
                        component={NavLink}
                        to="/movies"
                        sx={{
                            color: theme === "dark" ? "#fff" : "#000",
                            textDecoration: "none",
                            "&.active": { borderBottom: `2px solid ${theme === "dark" ? "#fff" : "#000"}` },
                        }}
                    >
                        Movies
                    </Button>
                    <Button
                        component={NavLink}
                        to="/tvshows"
                        sx={{
                            color: theme === "dark" ? "#fff" : "#000",
                            textDecoration: "none",
                            "&.active": { borderBottom: `2px solid ${theme === "dark" ? "#fff" : "#000"}` },
                        }}
                    >
                        TV Shows
                    </Button>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={theme === "dark"}
                                onChange={toggleTheme}
                                color="default"
                            />
                        }
                        label={theme === "dark" ? "Dark Mode" : "Light Mode"}
                        sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
