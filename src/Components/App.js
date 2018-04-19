import React, { Component, Fragment } from "react"
import { render } from "react-dom"
import { Header, Footer } from "./Layouts"
import Game from "./Game"


export default class extends Component {
  
  render(){
    return (
      <Fragment>
        <Header />
        
        <Game />
        
      </Fragment>
    )
  }
  
}