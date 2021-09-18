import React, { useEffect, useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import '../styles/Login.css';
import { TextField, Button, Typography } from '@material-ui/core';
import { BeatLoader } from "react-spinners";

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { signup } = useAuth();

  useEffect(() => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  }, [, password, confirmPassword]);

  async function handleSignUp(e) {
    if (password != confirmPassword) return;
    if (password.length == 0 || email.length == 0 || confirmPassword.length == 0) {
      setError('Please fill out all fields');
      return;
    }
    try {
      setIsLoading(true);
      await signup(email, password);
      history.push('/onboarding');
    } catch (e) {
      console.log(e);
      setError("Failed to create account");
    }
  }
  return (
    isLoading ?
      <div className="loader" >
        <BeatLoader size={40} color="blue" />
      </div>
      :
      <div className="login-card">
        <h2>Sign Up</h2>
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
        <TextField
          className="login-inp"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined" />
        <Typography
          variant="subtitle2"
          style={{
            color: 'red',
            margin: '10px'
          }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => { handleSignUp(e) }}>
          Sign Up</Button>
        <Typography
          variant="subtitle1"
          style={{ margin: '10px' }}>
          Already have an account? <Link to='/login'>Log in</Link>
        </Typography>
      </div>
  )
}
