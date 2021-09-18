import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import '../styles/Login.css';
import { TextField, Button, Typography } from '@material-ui/core';
import { auth } from '../firebase';
import { BeatLoader } from 'react-spinners';
import api from '../config/apiConfig.json';
import Loader from '../components/Loader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (email.length == 0 || password.length == 0) {
        setError('Please enter your email and password');
        return;
      }
      setIsLoading(true);
      await login(email, password);
      const requestOptions = {
        method: 'GET'
      };
      const response = await fetch(api.baseUrl + '/api/userExists?email=' + email, requestOptions);
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        //if (responseData.exists) {
        history.push('/');
        //} else {
        //history.push('/onboarding');
        //}
      } else {
        setError('There was an error logging in');
        setIsLoading(false);
      }
    }
    catch (err) {
      console.log(e);
      setError(err.message);
    }
  }
  return (
    isLoading ?
      <Loader />
      :
      <div className="login-card">
        <h2>Login</h2>
        <TextField
          className="login-inp"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <TextField
          className="login-inp"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined" />
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => handleLogin(e)}
        >Login</Button>
        <Typography
          variant="subtitle1"
          style={{ margin: '10px' }}>
          Don't have an account? <Link to='/signup'>Sign up</Link>
        </Typography>
      </div>
  )
}
