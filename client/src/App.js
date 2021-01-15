import React, {Component} from 'react';
import StockList from './components/StockList';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const getStock = async ticker => {
  console.log("Getting data");
  const request = await fetch(`http://localhost:5000/api/stocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      ticker: ticker,
      type: "daily"
    })
  });

  const data = await request.json();
  console.log(data);
  return data;
};

class App extends Component {
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <StockList />
          <div>
            <button onClick={() => getStock('AAPL', 'daily')}>Get stock</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
