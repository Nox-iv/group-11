import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Link,
  useMediaQuery,
  ButtonGroup,
  AppBar,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";

import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import Search from '../media-search/Search';
import { AuthContext } from "../../context/authContext";

export default function Navigation({ searchHidden = false }: { searchHidden?: boolean }) {
  const [hideSearch, setHideSearch] = useState(searchHidden);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMobile = useMediaQuery('(max-width:630px)');
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (isMobile || searchHidden) {
      setHideSearch(true);
    } else {
      setHideSearch(false);
    }
  }, [isMobile, searchHidden]);

  const handleSearch = (searchTerm: string) => {
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  const handlePersonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  return (
    <Box component="nav" aria-label="Main navigation">
      <AppBar position="static" sx={{ height: '100px', backgroundColor: '#333' }}>
        <Toolbar sx={{ marginTop: '1px' }}>
          {(!isMobile || (isMobile && hideSearch)) && (
            <>
              {/* Logo with alt text */}
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                <Link href="/" aria-label="Home">
                  <img 
                    src={'/logo.png'} 
                    height={100} 
                    alt="Company Logo" 
                  />
                </Link>
              </Typography>

              {/* Right Side Icons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Search
                  width="400px"
                  hidden={hideSearch}
                  onSearch={handleSearch}
                  aria-label="Site Search"
                />

                <ButtonGroup sx={{ marginLeft: '8px' }}>
                  {/* Toggle search on mobile */}
                  {isMobile && (
                    <Tooltip title="Search">
                      <IconButton
                        onClick={() => setHideSearch(!hideSearch)}
                        aria-label="Toggle search bar"
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Notifications */}
                  <Tooltip title="Notifications">
                    <IconButton aria-label="Notifications">
                      <NotificationsIcon />
                    </IconButton>
                  </Tooltip>

                  {/* If NOT logged in => Show Login & Register icons */}
                  {!user && (
                    <>
                      <Tooltip title="Login">
                        <IconButton
                          onClick={() => navigate('/login')}
                          aria-label="Login"
                        >
                          <LoginIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Register">
                        <IconButton
                          onClick={() => navigate('/register')}
                          aria-label="Register"
                        >
                          <PersonAddIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}

                  {/* If logged in => Person icon w/ dropdown menu */}
                  {user && (
                    <>
                      <Tooltip title="User Menu">
                        <IconButton onClick={handlePersonClick} aria-label="User menu">
                          <PersonIcon />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        aria-label="User menu options"
                      >
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            navigate('/profile');
                          }}
                        >
                          Profile
                        </MenuItem>

                        {/* If admin => Manage Users */}
                        {user.role === 'admin' && (
                          <MenuItem
                            onClick={() => {
                              handleMenuClose();
                              navigate('/admin/users');
                            }}
                          >
                            Manage Users
                          </MenuItem>
                        )}

                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </>
                  )}
                </ButtonGroup>
              </Box>
            </>
          )}

          {/* Mobile search view */}
          {isMobile && !hideSearch && (
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginTop: '20px' }}>
              <Search
                width="100%"
                hidden={hideSearch}
                onSearch={handleSearch}
                aria-label="Site Search"
              />
              <Tooltip title="Close search">
                <IconButton
                  onClick={() => setHideSearch(!hideSearch)}
                  aria-label="Close search bar"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
