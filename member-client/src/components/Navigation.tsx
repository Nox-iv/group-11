import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { Box, Toolbar, IconButton, Typography, Link, useMediaQuery, ButtonGroup } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from "@mui/material/AppBar";

import Search from './Search';
import { MediaSearchRequest } from "../api/types/mediaSearchRequest";

export default function Navigation({ searchHidden = false }: { searchHidden?: boolean }) {
    const [hideSearch, setHideSearch] = useState(searchHidden);
    const isMobile = useMediaQuery('(max-width:630px)');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isMobile || searchHidden) {
            setHideSearch(true);
        } else {
            setHideSearch(false);
        }
    }, [isMobile, searchHidden]);

    const handleSearch = (searchRequest: MediaSearchRequest) => {
        navigate(`/search?searchTerm=${searchRequest.searchTerm}`);
    }

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
                                <Search 
                                    width="400px" 
                                    hidden={hideSearch} 
                                    onSearch={handleSearch}
                                />
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
                            <Search width="100%" hidden={hideSearch} onSearch={handleSearch} />
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

