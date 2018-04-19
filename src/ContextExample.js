import React, { Component } from 'react';

// First make context

const MyContext = React.createContext();

// Then create provider component

class MyProvider extends Component {
  state = {
    name: 'Thom',
    age: 100,
    cool: true
  }
  render(){
    return (
      <MyContext.Provider value={{
        state:this.state,
        birthDay: () => this.setState({age: this.state.age + 1})
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}
const Family = (props) => (
  <div className="family">
    {/* <Person  {...props}/> */}
    <Person/>
  </div>
)

class Person extends Component {
  render() {
    return (
      <div className="person">
        <MyContext.Consumer>
          {context => (
            <React.Fragment>
              <p> I am {context.state.name}</p>
              <p> I am {context.state.age} </p>
              <button onClick={context.birthDay}> Cake time</button>
           </React.Fragment>
          )}
        </MyContext.Consumer>
      </div>
    );
  }
}


class App extends Component {
  state = {
    name: 'Thom',
    age: 100,
    cool: true
  }
  render() {
    return (
      <MyProvider>
        <div>
          {/* <Family {...this.state}/> */}
          <Family/>
        </div>
      </MyProvider>
    );
  }
}

export default App;
