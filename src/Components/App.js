import React, { Component, Fragment } from "react"
import { Header } from "./Layouts"
import Game from "./Game"


export default class extends Component {

  render() {
    return (
      <Fragment>
        <Header />

        <Game />

      </Fragment>
    )
  }

}