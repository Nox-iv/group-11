import { useEffect, useState } from "react";
import { Box, Toolbar, IconButton, Typography, Link, useMediaQuery } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Search from './Search';
import AppBar from "@mui/material/AppBar";

export default function Navigation() {
    const [hideSearch, setHideSearch] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (isMobile) {
            setHideSearch(true);
        } else {
            setHideSearch(false);
        }
    }, [isMobile]);

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ height: '100px' }}>
                <Toolbar>
                    {(!isMobile || (isMobile && hideSearch)) && (
                        <>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                <Link href="/">
                                    <img src={'../../public/logo.png'} height={100} alt="Logo" />
                                </Link>
                            </Typography>
                            <Search width="400px" hidden={hideSearch} />
                            {isMobile && (
                                <IconButton onClick={() => setHideSearch(!hideSearch)}>
                                    <SearchIcon />
                                </IconButton>
                            )}
                            <IconButton>
                                <NotificationsIcon />
                            </IconButton>
                            <IconButton>
                                <PersonIcon />
                            </IconButton>
                        </>
                    )}
                    {isMobile && !hideSearch && (
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginTop: '20px' }}>
                            <Search width="100%" hidden={hideSearch} />
                            <IconButton onClick={() => setHideSearch(!hideSearch)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

