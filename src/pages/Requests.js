import React, { useEffect, useState } from 'react'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import Loader from '../components/Loader';
import api from '../config/apiConfig.json';
import { JSON } from 'sequelize-cockroachdb';

function Requests() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInd, setSelectedInd] = useState(0);
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    var reqs = currentProfile.requestsSent;
    console.log();

    setSelected(JSON.parse(reqs[selectedInd]).meds)
    console.log(JSON.parse(reqs[selectedInd]).meds);
    for (let i = 0; i < reqs.length; i++) {
      fetch(api.baseUrl + '/api/getNgoByMail?email=' + reqs)
        .then(resp => resp.json())
        .then(resp => {
          reqs[i] = { ...JSON.parse(reqs[i]), name: resp.data.name }
        })
    }
    setRows(reqs);
    setIsLoading(false);
  }, [])

  useEffect(() => {
    var reqs = currentProfile.requestsSent;
    setSelected(JSON.parse(reqs[selectedInd]).meds)
  }, [selectedInd])
  return (
    isLoading ?
      <Loader />
      :
      <div>
        <Typography variant="h4" style={{
          margin: "40px auto",
          textAlign: "center"
        }}>
          Requests Sent
        </Typography>
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: 'wrap'
        }}>
          <TableContainer component={Paper} style={{ maxWidth: "500px", maxHeight: "600px", marginRight: "20px" }}>
            <Table sx={{ minWidth: 600 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>NGO Name</TableCell>
                  <TableCell align="right">Sent on</TableCell>
                  {/* <TableCell align="right"></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row, ind) => {
                  //row = JSON.parse(row);
                  var date = new Date(row.date);
                  date.setHours(0, 0, 0, 0);
                  var col = "white";
                  if (ind === selectedInd) col = "#d2d2d2"
                  return (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      style={{
                        backgroundColor: col,
                      }}
                      onClick={() => setSelectedInd(ind)}
                    >
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell align="right">{date.toString()}</TableCell>
                      {/* <TableCell align="right" onClick={(e) => {
                        console.log(ind);
                        var t = [...rows];
                        t.splice(ind, 1);
                        setRows(t);
                      }}><Delete /></TableCell> */}
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
      </div>
  )
}

export default Requests
