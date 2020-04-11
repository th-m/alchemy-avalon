import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core' // Hip way of using material ui components
import logo from '../../assets/imgs/logo.svg';
import '../../App.css';

export default () =>
  <AppBar position="static" color="transparent">
    <Toolbar>
      <IconButton color="inherit" aria-label="Menu">
        <img src={logo} className="App-logo" alt="logo" />
      </IconButton>
      <Typography variant="h4" color="inherit">
        Alchemy Games
      </Typography>
    </Toolbar>
  </AppBar>
