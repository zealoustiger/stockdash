import logo from './logo.svg';
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button onClick={() => getStock("AAPL", 'daily')}>Get stock</button>
        </div>
      </header>
    </div>
  );
}

export default App;
