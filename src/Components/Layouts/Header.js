import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from 'material-ui' // Hip way of using material ui components
// import MenuIcon from 'material-ui-icons/Menu'; 
import logo from '../../assets/imgs/logo.svg';
import '../../App.css';
//NOTE we probably will remove material-ui-icons and replace it with fontawesome
export default props =>
    <AppBar position="static" color="black">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
            <img src={logo} className="App-logo" alt="logo" />
        </IconButton>
        <Typography  variant="title" color="inherit">
          <span className="light_text">Alchemy Games</span>
        </Typography>
        {/* <Button color="inherit">Login</Button> */}
      </Toolbar>
    </AppBar>
  