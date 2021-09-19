import { Button, Typography } from '@material-ui/core';
import React from 'react'
import { Link } from 'react-router-dom';

function NgoDashboard() {
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  return (
    <div
      style={{
        textAlign: "center"
      }}>
      <Typography variant="h3" style={{
        marginBottom: "40px"
      }}>
        Welcome back {currentProfile.name}!
      </Typography>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Link to='/donationRequests' style={{
          marginRight: "20px"
        }}>
          <Button color="primary" variant="contained">
            View All Requests
          </Button>
        </Link>
        <Link to='/donationsReceived'>
          <Button color="primary" variant="contained">
            View All Donations
          </Button>
        </Link>
      </div>

    </div>
  )
}

export default NgoDashboard
