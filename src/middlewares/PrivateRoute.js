import { Box, AppBar, Toolbar, IconButton, MenuIcon, Typography, Button } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { Route, Redirect, useHistory, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from '../config/apiConfig.json';
import Loader from "../components/Loader";
import { Person } from "@material-ui/icons";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, logout } = useAuth()
  const history = useHistory();
  const [exists, setExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    }
    fetch(`${api.baseUrl}/api/userExists?email=${currentUser?.email}`, requestOptions)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.success)
          setExists(data.exists);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);
  async function handleLogout(e) {
    e.preventDefault();
    await logout();
    history.push("/login");
  }
  return (
    isLoading ?

      <div>
        <Loader /></div>
      :
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                {/* <MenuIcon /> */}
              </IconButton>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} style={{
                  fontWeight: 'bold'
                }}>
                  Med Camp
                </Typography>
              </Link>
              <div style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}>
                <Link to="/profile" style={{ textDecoration: "none", color: "white", marginRight: "20px" }}>
                  <Person />
                </Link>
                <Button
                  color="inherit"
                  onClick={(e) => handleLogout(e)}>
                  Logout
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </Box>
        <Route
          {...rest}
          render={props => {
            if (!exists && history.location.pathname !== "/onboarding")
              return history.push("/onboarding");
            if (exists && history.location.pathname == "/onboarding")
              return history.push("/");
            return currentUser ? <Component {...props} /> : <Redirect to="/login" />
          }
          }
        ></Route>
      </div>
  )
}