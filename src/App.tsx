import React, { Component, useState } from "react"
import { Header, Footer } from "./Components/Layouts"
import Game from "./Components/Game"
import { DevUtils } from './Components/DevUtils/dev-utils.component'
import { ThemeProvider } from '@material-ui/core/styles';
import { GameProvider } from "./provider";
import { Chancellor, Agent, Assassin } from './assets/imgs/jer_pics'
import { emotion } from "./assets/imgs/jer_pics/types";

const Pics = () => {
  const [expression, setExpression] = useState<emotion>("anger")
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100vw" }}>
        <Chancellor expression={expression} />
        <Agent expression={expression} />
        <Assassin expression={expression} />
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100vw" }}>

        <button onClick={() => setExpression("anger")}>"anger"</button>
        <button onClick={() => setExpression("surprise")}>"surprise"</button>
        <button onClick={() => setExpression("concern")}>"concern"</button>
        <button onClick={() => setExpression("smirk")}>"smirk"</button>
      </div>
    </>
  )
}

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
        {/* <Pics /> */}
      </div>
    )
  }

}