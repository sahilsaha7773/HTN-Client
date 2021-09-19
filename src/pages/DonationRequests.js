import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { Delete, IndeterminateCheckBoxTwoTone } from '@material-ui/icons';
import Loader from '../components/Loader';
import api from '../config/apiConfig.json';
import { toast, ToastContainer } from 'react-toastify';

function DonationRequests() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInd, setSelectedInd] = useState(0);
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  const [selected, setSelected] = useState([]);

  useEffect(async () => {
    var reqs = currentProfile.requests;
    console.log();
    if (currentProfile.requests.length === 0) {
      setIsLoading(false);
      return;
    }
    setSelected(JSON.parse(reqs[selectedInd]).meds)
    console.log(JSON.parse(reqs[selectedInd]));
    for (let i = 0; i < reqs.length; i++) {
      try {
        reqs[i] = JSON.parse(reqs[i]);
      } catch (err) {
        console.log(err);
      }
      const resp = await fetch(api.baseUrl + '/api/getUserByMail?email=' + reqs[i].email);

      const data = await resp.json();
      console.log(data);
      if (resp.success)
        reqs[i] = { ...reqs[i], name: data.data.name }
    }
    setRows(reqs);
    console.log(reqs);

    setIsLoading(false);
  }, [selectedInd])

  function handleReceiveDonation(e, ind) {
    e.preventDefault();
    const id = currentProfile.id;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        ind: ind,
      })
    }
    setIsLoading(true);
    fetch(api.baseUrl + '/api/receiveDonation', requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
        if (resp.success) {
          fetch(api.baseUrl + '/api/getProfileByMail?email=' + currentProfile.email)
            .then(resp => resp.json())
            .then(async resp => {
              if (resp.success) {
                await localStorage.setItem('currentProfile', JSON.stringify(resp.data));
                setIsLoading(false);
                toast('Donation received successfully!', {
                  theme: 'dark',
                })
              }
            })
        }
      })
  }
  // useEffect(() => {
  //   var reqs = currentProfile.requestsSent;
  //   setSelected((reqs[selectedInd]).meds)
  // }, [selectedInd])
  return (
    isLoading ?
      <Loader />
      :
      <div>
        <Typography variant="h4" style={{
          margin: "40px auto",
          textAlign: "center"
        }}>
          Donation Requests
        </Typography>
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: 'wrap'
        }}>
          {
            currentProfile.requests.length === 0 ?
              <Typography variant="h5">
                No Requests Received
              </Typography>
              :
              <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: 'wrap'
              }}>
                <TableContainer component={Paper} style={{ maxWidth: "800px", maxHeight: "600px", marginRight: "20px" }}>
                  <Table sx={{ minWidth: 600 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell align="right">Recieved on</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows?.map((row, ind) => {
                        //row = JSON.parse(row);

                        console.log(row);
                        var date = new Date(row.date);
                        date.setHours(0, 0, 0, 0);
                        var col = "white";
                        if (ind === selectedInd) col = "#d2d2d2"
                        return (
                          <TableRow
                            key={IndeterminateCheckBoxTwoTone}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            style={{
                              backgroundColor: col,
                            }}
                            onClick={() => setSelectedInd(ind)}
                          >
                            <TableCell component="th" scope="row">
                              {row.userName}
                            </TableCell>
                            <TableCell align="right">{date.toString()}</TableCell>
                            <TableCell align="right" onClick={(e) => {
                              console.log(ind);
                              // var t = [...rows];
                              // t.splice(ind, 1);
                              // setRows(t);
                            }}><Button onClick={(e) => handleReceiveDonation(e, ind)}>Receive Donation</Button></TableCell>
                          </TableRow>
                        )
                      })}

                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer component={Paper} style={{ maxWidth: "800px", maxHeight: "600px" }}>
                  <Table sx={{ minWidth: 600 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medicine Name</TableCell>
                        <TableCell align="right">Manufacturing Date</TableCell>
                        <TableCell align="right">Expiry Date</TableCell>
                        <TableCell align="right">Batch Number</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        {/* <TableCell align="right"></TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selected.map((row, ind) => {

                        //console.log(row);
                        //row = JSON.parse(row);
                        return (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.manDate}</TableCell>
                            <TableCell align="right">{row.expDate}</TableCell>
                            <TableCell align="right">{row.batch}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            {/* <TableCell align="right" onClick={(e) => {
                      }}><Delete /></TableCell> */}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
          }
          <ToastContainer />
        </div>
      </div>
  )
}

export default DonationRequests
