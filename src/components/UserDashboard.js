import { Button, Card, CardActions, CardContent, TextField, Typography } from '@material-ui/core';
import { Email, Phone } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import api from '../config/apiConfig.json';

function UserDashboard() {
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  const [ngoList, setNgoList] = useState([]);
  const [dist, setDist] = useState(100);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: currentProfile.lattitude,
        lon: currentProfile.longitude,
        dist: dist
      })
    }

    fetch(api.baseUrl + '/api/nearByNgos', requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
        if (resp.success) {
          setNgoList(resp.data);
        }
        setIsLoading(false);
      })

  }, [dist]);
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
        textAlign: "left",
        maxWidth: "800px",
        margin: "auto"
      }}>
        <TextField variant="standard"
          type="number"
          onChange={(e) => setDist(e.target.value)}
          value={dist} label="Distance (in Km)" />
      </div>

      {
        isLoading ?
          <div>
            <ClipLoader style={{
              marginTop: "100px !important"
            }} color="blue" size={50} />
          </div> :
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: "800px",
            margin: "40px auto"
          }}>
            {ngoList.length === 0 && (
              <Typography variant="subtitle1">
                No NGOs found
              </Typography>
            )}
            {
              ngoList.map(ngo => {
                return (
                  <Card sx={{ minWidth: 275 }} elevation={5} style={{ width: "400px", textAlign: 'left', margin: "20px" }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>

                      </Typography>
                      <Typography variant="h4" component="div">
                        {ngo.name}
                      </Typography>
                      <Typography color="text.secondary" variant="subtitle1" style={{
                        fontSize: "18px"
                      }}>
                        {ngo.distance} km away
                      </Typography>
                      <Typography color="text.secondary" variant="subtitle1" style={{
                        fontSize: "18px"
                      }}>
                        {ngo.city}, {ngo.state}, {ngo.country}
                      </Typography>
                      <Typography variant="h6" style={{
                        margin: "20px 0"
                      }}>
                        Contact Info
                      </Typography>
                      <div className="row">
                        <Phone style={{
                          margin: "0 5px"
                        }} />
                        <Typography variant="subtitle1">
                          {ngo.phonenumber}
                        </Typography>
                      </div>
                      <div className="row" style={{
                        margin: "10px 0"
                      }}>
                        <Email style={{
                          margin: "0 5px"
                        }} />
                        <Typography variant="subtitle1">
                          {ngo.email}
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Link to={'/donate/' + ngo.id}>
                        <Button size="small" color="primary">Donate</Button>
                      </Link>
                    </CardActions>
                  </Card>
                )
              })
            }
          </div>
      }
    </div>
  )
}

export default UserDashboard
