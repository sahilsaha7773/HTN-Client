import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../config/apiConfig.json';
import Loader from '../components/Loader';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import latlot from '../utils/latlot';
import GoogleMap from '../components/MapContainer';
import MapContainer from '../components/MapContainer';
import { toast, ToastContainer } from 'react-toastify';
import { Delete, Email, Phone } from '@material-ui/icons';

function Donate() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [ngo, setNgo] = useState({});
  const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
  const [rows, setRows] = useState([]);

  const [reqSent, setReqSent] = useState(false);

  const [name, setName] = useState('');
  const [manDate, setManDate] = useState('');
  const [expDate, setExpDate] = useState('');
  const [batch, setBatch] = useState('');
  const [quantity, setQuantity] = useState('');

  function handleDonate(e) {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: currentProfile.id,
        to: id,
        meds: rows
      })
    }
    fetch(api.baseUrl + '/api/sendRequest', requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
        toast("Donation Request Sent Successfully!", {
          theme: 'dark'
        });
        setIsLoading(false);
        setRows([]);
      })
  }
  useEffect(() => {
    fetch(api.baseUrl + '/api/getNgoById?id=' + id)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.success) {
          const reqs = resp.data.requests;
          var ind;
          for (let i = 0; i < reqs.length; i++) {
            var data = JSON.parse(reqs[i]);
            if (data.email === currentProfile.email) {
              ind = i;
              break;
            }
          }
          setNgo(resp.data);
          setIsLoading(false);
        }
      })
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    if (name.length === 0 || manDate.length === 0 || expDate.length === 0 || batch.length === 0 || quantity.length === 0) {
      toast("All fields are required!", {
        theme: 'dark'
      });
      return;
    }
    console.log("Asdas");
    var temp = rows;
    temp.push();
    //console.log(temp);
    setRows(prev => [...prev, {
      name,
      manDate,
      expDate,
      batch,
      quantity
    }]);
    console.log(rows);
  }
  //console.log(id);
  return (
    isLoading ?
      <Loader />
      :
      <div style={{
        padding: "50px 40px",
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',

      }}>
        <div>
          <Typography variant="h2">
            {ngo.name}
          </Typography>
          <Typography variant="h4">
            {Math.ceil(latlot.getDistanceFromLatLonInKm(currentProfile.lattitude,
              currentProfile.longitude,
              ngo.lattitude,
              ngo.longitude
            ))}km away
          </Typography>
          <Typography variant="h5" style={{
            margin: "10px 0"
          }}>
            {ngo.city}, {ngo.state}, {ngo.country}
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
          <MapContainer />
        </div>
        <div>
          <TableContainer component={Paper} style={{ maxWidth: "1000px", maxHeight: "600px" }}>
            <Table sx={{ minWidth: 600 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Medicine Name</TableCell>
                  <TableCell align="right">Manufacturing Date</TableCell>
                  <TableCell align="right">Expiry Date</TableCell>
                  <TableCell align="right">Batch Number</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key="add"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <TextField variant="outlined" label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} />
                  </TableCell>
                  <TableCell align="right">
                    <TextField variant="outlined" type="date"
                      value={manDate}
                      onChange={(e) => setManDate(e.target.value)} />
                  </TableCell>
                  <TableCell align="right">
                    <TextField variant="outlined" type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)} />
                  </TableCell>
                  <TableCell align="right">
                    <TextField variant="outlined" label="Batch No."
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)} />
                  </TableCell>
                  <TableCell align="right">
                    <TextField variant="outlined" label="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)} />
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={(e) => handleAdd(e)}>
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
                {rows.map((row, ind) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.manDate}</TableCell>
                    <TableCell align="right">{row.expDate}</TableCell>
                    <TableCell align="right">{row.batch}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right" onClick={(e) => {
                      console.log(ind);
                      var t = [...rows];
                      t.splice(ind, 1);
                      setRows(t);
                    }}><Delete /></TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>

          <Button onClick={(e) => handleDonate(e)}>
            Donate
          </Button>
        </div>
        <ToastContainer />
      </div>
  )
}

export default Donate
