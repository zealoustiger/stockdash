import React, {Component} from 'react';
import StockList from './components/StockList';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component {
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <StockList />
          <div></div>
        </header>
      </div>
    );
  }
}

export default App;
