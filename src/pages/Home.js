import { Button, Paper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import NgoDashboard from '../components/NgoDashboard';
import UserDashboard from '../components/UserDashboard';
import api from '../config/apiConfig.json';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import MedCamp from '../images/MedCamp.png';

function Home() {
  const [currentProfile, setCurrentProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  console.log(currentUser.email);
  useEffect(() => {
    fetch(api.baseUrl + '/api/getProfileByMail?email=' + currentUser.email)
      .then(resp => resp.json())
      .then(async resp => {
        console.log(resp);
        if (resp.success) {
          setCurrentProfile(resp.data)
          await localStorage.setItem('currentProfile', JSON.stringify(resp.data));
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }, []);
  return (
    isLoading ?
      <Loader />
      :
      <div>

        {currentProfile.role === 'ngo' ?
          <div style={{
            margin: '40px auto',
            display: 'flex',
            maxWidth: "800px",
          }}>
            <Paper
              elevation={3}
              style={{
                width: "400px",
                textAlign: "center",
                padding: "60px 20px",
                margin: "10px"
              }}
            >
              <Typography variant="h2">
                {currentProfile.requests.length}
              </Typography>
              <Typography variant="h5">
                Donation Requests
              </Typography>
            </Paper>
            <Paper
              elevation={3}
              style={{
                width: "400px",
                textAlign: "center",
                padding: "60px 20px",
                margin: "10px"
              }}
            >
              <Typography variant="h2">
                {currentProfile.donations.length}
              </Typography>
              <Typography variant="h5">
                Donations Received
              </Typography>
            </Paper>
          </div>
          : <div style={{
            margin: '40px auto',
            display: 'flex',
            maxWidth: "800px",
          }}>
            <Paper
              elevation={3}
              style={{
                width: "400px",
                textAlign: "center",
                padding: "60px 20px",
                margin: "10px"
              }}
            >
              <Typography variant="h2">
                {currentProfile.requestsSent.length}
              </Typography>
              <Typography variant="h5">
                Requests Sent
              </Typography>
              <Link to='/requests'>
                View all
              </Link>
            </Paper>
            <Paper
              elevation={3}
              style={{
                width: "400px",
                textAlign: "center",
                padding: "60px 20px",
                margin: "10px"
              }}
            >
              <Typography variant="h2">
                {currentProfile.donations.length}
              </Typography>
              <Typography variant="h5">
                Donated
              </Typography>
              <Link to='/yourDonations'>
                View all
              </Link>
            </Paper>
          </div>
        }
        {
          currentProfile.role === 'ngo' ? <NgoDashboard /> : <UserDashboard />
        }
      </div>
  )
}

export default Home
