import React, { Component } from "react"
import { Header, Footer } from "./Components/Layouts"
import Game from "./Components/Game"
import { DevUtils } from './Components/DevUtils/dev-utils.component'
import { ThemeProvider } from '@material-ui/core/styles';
import { GameProvider } from "./provider";

export default class extends Component {

  render() {
    return (
      <div style={{
        height: '100vh',
        display: "grid",
        gridTemplateRows: "auto 1fr auto"
      }}>
        <GameProvider>

          <Header />
          <Game />
          <Footer />
          <DevUtils />
        </GameProvider>
      </div>
    )
  }

}