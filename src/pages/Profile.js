import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import addressData from '../data/addressData.json';
import React, { useState } from 'react'
import api from '../config/apiConfig.json';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentProfile.name);
  const [country, setCountry] = useState(currentProfile.country);
  const [state, setState] = useState(currentProfile.state);
  const [city, setCity] = useState(currentProfile.city);
  const [website, setWebsite] = useState(currentProfile.website);
  const [phoneNumber, setPhoneNumber] = useState(currentProfile.phonenumber);
  const [fbLink, setFbLink] = useState(currentProfile.facebooklink);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleUpdate(e) {
    const id = currentProfile.id;

    if (currentProfile.role === 'ngo') {
      if (phoneNumber.length === 0) {
        setError("All fields are required");
        return;
      }
    }
    if (name.length === 0 || country.length === 0 || state.length === 0 || city.length === 0) {
      setError("All fields are required");
      return;
    }
    var url = api.baseUrl;

    if (currentProfile.role === 'ngo') {
      url += '/api/editNgo?id=' + id;
    } else {
      url += '/api/editUser?id=' + id;
    }

    const ct = addressData.filter(item => item.name === country)[0]
      .states.filter(item => item.name === state)[0]
      .cities.filter(item => item.name === city)[0];

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        country: country,
        state: state,
        city: city,
        lattitude: ct.latitude,
        longitude: ct.longitude,
        website: website,
        phonenumber: phoneNumber,
        fbLink: fbLink,
      })
    }

    setIsLoading(true);
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        //Get Updated Profile
        fetch(api.baseUrl + '/api/getProfileByMail?email=' + currentUser.email)
          .then(response => response.json())
          .then(async data => {
            await localStorage.setItem('currentProfile', JSON.stringify(data.data));
            setIsLoading(false);
            toast('Profile Successfully Updated!');
            setError("");
          })
      });
  }
  return (
    isLoading ?
      <Loader />
      :
      <div style={{
        maxWidth: '700px',
        margin: "40px auto",
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom>
          Edit Your Profile
        </Typography>
        {
          currentProfile.role === 'ngo' ?
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
            color: 'red',
            textAlign: 'left',
          }}
          variant="subtitle1">
          {error}
        </Typography>
        <FormControl style={{
          margin: '20px 0',
        }} fullWidth>
          <Button variant="contained" color="primary"
            onClick={(e) => handleUpdate(e)}
            style={{ margin: '0' }}>
            Update Account
          </Button>

        </FormControl>
        <ToastContainer position="top-right" theme="dark" />
      </div>
  )
}

export default Profile
