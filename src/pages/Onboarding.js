import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import addressData from '../data/addressData.json';
import api from '../config/apiConfig.json';
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import Loader from 'react-spinners/BarLoader';

function Onboarding() {
  const [role, setRole] = useState('NGO');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fbLink, setFbLink] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useAuth();

  const history = useHistory();

  function handleCreate(e) {
    e.preventDefault();
    if (role == 'ngo' && phoneNumber.length === 0) {
      setError("All fields are required");
      return;
    }
    if (name.length === 0 || state.length === 0 || city.length === 0) {

      setError("All fields are required");
      return;
    }
    const ct = addressData.filter(item => item.name === country)[0]
      .states.filter(item => item.name === state)[0]
      .cities.filter(item => item.name === city)[0];

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: currentUser.email,
        country: country,
        state: state,
        city: city,
        lattitude: ct.latitude,
        longitude: ct.longitude,
        website: website,
        phonenumber: phoneNumber,
        fbLink: fbLink,
        firebase_id: currentUser.uid,
      })
    }
    console.log(requestOptions.body);
    var url;
    if (role === 'Individual') {
      url = api.baseUrl + '/api/createUser';
    } else {
      url = api.baseUrl + '/api/createNgo';
    }
    setIsLoading(true);

    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
        setIsLoading(false);
        if (!resp.success) {
          setError(resp.messege);
          return;
        }
        setError('');
        history.go('/');
        //history.push('/');
      })
      .catch(err => {
        setError(err.messege);
        setIsLoading(false);
      })
  }
  return (
    isLoading ?
      <Loader />
      :
      <div style={{
        textAlign: 'center',
        margin: '40px auto',
        maxWidth: '800px',
      }}>
        <Typography variant="h4">Complete Your Account</Typography>
        <FormControl style={{
          margin: '20px',
        }} fullWidth>
          <InputLabel>Register As</InputLabel>
          <Select label="Select your account type" value={role} onChange={(e) => { setRole(e.target.value) }}>
            <MenuItem value="NGO">NGO</MenuItem>
            <MenuItem value="Individual">Individual</MenuItem>
          </Select>
          <div style={{
            marginTop: '40px',
          }}>
            {
              role === 'NGO' ?
                <div>
                  <TextField variant="outlined" fullWidth label="NGO Name" value={name}
                    style={{
                      margin: "10px 0"
                    }}
                    onChange={(e) => setName(e.target.value)} name="name" />
                  <TextField variant="outlined" fullWidth label="Website (Optional)" value={website}
                    style={{
                      margin: "10px 0"
                    }}
                    onChange={(e) => setWebsite(e.target.value)} name="website" />
                  <TextField variant="outlined" type="number" fullWidth label="Phone Number" value={phoneNumber}
                    style={{
                      margin: "10px 0"
                    }}
                    onChange={(e) => setPhoneNumber(e.target.value)} name="phoneNumber" />
                  <TextField variant="outlined" fullWidth label="Facebook Page (Optional)" value={fbLink}
                    style={{
                      margin: "10px 0"
                    }}
                    onChange={(e) => setFbLink(e.target.value)} name="Facebook Page" />
                </div>
                :
                <div>
                  <TextField variant="outlined" fullWidth label="Name" value={name}
                    onChange={(e) => setName(e.target.value)} name="name" />
                </div>
            }
            <Typography variant="h5" style={{ textAlign: 'left', margin: "20px 0" }}>Address</Typography>

            <FormControl style={{
              margin: '20px 0',
            }} fullWidth>
              <InputLabel>Country</InputLabel>
              <Select variant="outlined" color="primary" label="Country" value={country} onChange={(e) => { setCountry(e.target.value) }}>
                {
                  addressData.map((item) => {
                    return <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <FormControl style={{
              margin: '0',
            }} fullWidth>
              <InputLabel>State</InputLabel>
              <Select variant="outlined" color="primary" label="State" value={state} onChange={(e) => { setState(e.target.value) }}>
                {
                  addressData.filter(item => item.name === country)[0].states.map((item) => {
                    return <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                  })
                }
              </Select>
            </FormControl>
            <FormControl style={{
              margin: '20px 0',
            }} fullWidth>
              <InputLabel>City</InputLabel>
              <Select variant="outlined" color="primary" label="City" value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}>
                {
                  addressData
                    .filter(item => item.name === country)[0]
                    .states
                    ?.filter(item => item.name === state)[0]
                    ?.cities.map((item) => {
                      return <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                    })
                }
              </Select>
            </FormControl>
            <Typography
              style={{
                color: 'red'
              }}
              variant="subtitle1">
              {error}
            </Typography>
            <FormControl style={{
              margin: '20px 0',
            }} fullWidth>
              <Button variant="contained" color="primary"
                onClick={(e) => handleCreate(e)}
                style={{ margin: '0' }}>
                Create Account
              </Button>

            </FormControl>
          </div>
        </FormControl>
      </div>
  )
}

export default Onboarding
