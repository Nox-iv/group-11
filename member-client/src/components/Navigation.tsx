import { useEffect, useState } from "react";
import { Box, Toolbar, IconButton, Typography, Link, useMediaQuery, ButtonGroup } from "@mui/material";
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
        <Box>
            <AppBar position="static" sx={{ height: '100px'}}>
                <Toolbar>
                    {(!isMobile || (isMobile && hideSearch)) && (
                        <>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                <Link href="/">
                                    <img src={'../../public/logo.png'} height={100} alt="Logo" />
                                </Link>
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Search width="400px" hidden={hideSearch} />
                                <ButtonGroup sx={{marginLeft: '8px'}}>
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
                                </ButtonGroup>
                            </Box>
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

