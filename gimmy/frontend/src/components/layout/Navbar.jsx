// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, IconButton, Badge, Menu, MenuItem, Divider, Box, ListItemIcon, ListItemText, CircularProgress, Tooltip, Typography, Avatar } from '@mui/material'; // Added Typography, Avatar
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ensure AccountCircleIcon is imported
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GimmyLogo from '../GimmyLogo'; // Import the new logo component
import { useAuth } from '../../contexts/AuthContext';
import { getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService'; // Assuming this service exists
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    fetchNotifications();
  };
  const handleNotificationsClose = () => setNotificationsAnchorEl(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoadingNotifications(true);
    try {
      const data = await getUnreadNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]); // Clear notifications on error
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(); // Initial fetch
      // Optional: Set up polling or WebSocket for real-time notifications
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      fetchNotifications(); // Refresh list
      // TODO: Navigate to related content if notification.relatedEntityId exists
      // e.g., navigate(`/plans/${notification.relatedEntityId}`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
    handleNotificationsClose();
  };

  const handleMarkAllRead = async () => {
    try {
        await markAllNotificationsAsRead();
        fetchNotifications(); // Refresh list
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
    }
    handleNotificationsClose();
  };


  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />;

  return (
    <AppBar position="static">
      <Toolbar>
        <GimmyLogo size="h6" />
        <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

        {/* "All Exercises" button visible only if authenticated */}
        {isAuthenticated && (
          <Button color="inherit" component={RouterLink} to="/exercises">All Exercises</Button>
        )}

        {isAuthenticated ? (
          <>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationsOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              id="notifications-menu"
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              MenuListProps={{ 'aria-labelledby': 'notifications-button' }}
              PaperProps={{ style: { maxHeight: 300, width: '350px' } }}
            >
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p:1, borderBottom: '1px solid lightgray'}}>
                <Typography variant="subtitle1" sx={{pl:1}}>Notifications</Typography>
                {notifications.length > 0 &&
                    <Button size="small" onClick={handleMarkAllRead} disabled={loadingNotifications}>Mark all as read</Button>
                }
              </Box>
              {loadingNotifications ? (
                <MenuItem disabled><CircularProgress size={20} sx={{mx: 'auto', display: 'block'}} /></MenuItem>
              ) : notifications.length === 0 ? (
                <MenuItem disabled><ListItemText primary="No new notifications" /></MenuItem>
              ) : (
                notifications.map((notif) => (
                  <MenuItem key={notif.id} onClick={() => handleNotificationClick(notif)}>
                    <ListItemText primary={notif.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} secondary={notif.message} />
                  </MenuItem>
                ))
              )}
            </Menu>

            <Tooltip title={user?.name || "Account"}>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>{userInitial}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{ 'aria-labelledby': 'profile-button' }}
            >
              <MenuItem component={RouterLink} to={user?.role === 'trainer' ? "/trainer/dashboard" : "/trainee/dashboard"} onClick={handleMenuClose}>
                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
              </MenuItem>
              {/* <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>Profile</MenuItem> */}
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
