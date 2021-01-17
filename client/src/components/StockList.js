import React, {Component} from 'react';
import {Container, ListGroup, ListGroupItem, Button} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {v1 as uuid} from 'uuid/';
import axios from 'axios';

class StockList extends Component {
  state = {
    stocks: [],
    isLoading: true
  }

  componentDidMount(){
    this.getDBStocks();
  }

  refreshPrices(){
    //TODO: Fetch all stale stocks by date from mongo
    //TODO: implement 12 second rate limiter in Redis/Rabbitmq
    this.getAlphaStock("MA")
      .then(res => {
        //render after the response
        this.setState({stocks: this.state.stocks});
      });
  }

  update_symbol_with_price(symbol, price){
    this.setState(state => {
      const stocks = state.stocks.map( stock => {
        if(stock.name === symbol){
          console.log('found', stock.name, price);
          return stock.price = price;
        }
      });
    })
  }

  getDBStocks(){
    axios.get('http://localhost:5000/api/stocks')
      .then(res => {
        this.setState({stocks: res.data});
        console.log('From database:', this.state.stocks);
      });
  }

  // Get a single stock.
  async getAlphaStock(ticker){
    axios({
      method: 'post',
      url: 'http://localhost:5000/api/stocks/alpha',
      data: {
        "ticker": ticker,
        "type": "daily"
      }
    })
    .then(res => {
      const data = res.data.data;

      const symbol = data["Meta Data"]["2. Symbol"];
      const price = this.getLastPrice(data["Time Series (Daily)"]);
      console.log("updating price:", symbol, price);
      this.update_symbol_with_price(symbol, price);

      console.log('Final state', this.state.stocks);
      this.setState({isLoading: false});
      return this.state.stocks;
    });
  }

  // Get an array of stocks, but with 12 secs between each
  // Takes a long time to load
  async getAlphaStocksArray(){
    axios({
      method: 'post',
      url: 'http://localhost:5000/api/stocks/alpha-unlimited',
      data: {
        "tickers": ["UNH", "MA"],
        "type": "daily"
      }
    })
    .then(res => {
      const tickers = res.data.tickers;

      tickers.map( ticker => {
        const symbol = ticker[0]["2. Symbol"]; // Get current symbol
        const price = this.getLastPrice(ticker[1]);
        console.log("updating price:", symbol, price);
        this.update_symbol_with_price(symbol, price);
      });

      console.log('Final state', this.state.stocks);
      this.setState({isLoading: false});
      return this.state.stocks;
    });
  }

  getLastPrice(priceArr){
    // Get the last price from JSON array
    // TODO: probably easier way to do this.
    // Get last index via Object.keys(prices).length-1
    // Get the key of that index via Object.keys(prices)[index]
    // Get the actual price via prices[key]
    const price = priceArr[Object.keys(priceArr)[Object.keys(priceArr).length-1]];
    const open_price = price["1. open"];
    return open_price;
  }

  render() {
    const {stocks} = this.state;
    console.log('render', stocks);

    return(
        <Container>

          <Button
            color="dark"
            style={{marginBottom: '2rem'}}
            onClick={() => {
              const name = prompt('Enter Stock');
              console.log (name);
              if(name) {
                axios.post('http://localhost:5000/api/stocks', {name})
                  .then(res => {
                    const { _id, name } = res.data;
                    this.setState(state => ({
                      stocks: [...state.stocks, { _id, name }]
                    }));
                  })
                  .catch((e) => {
                    console.log(e);
                    return e;
                  })
              }
            }}
          >Add Stock
          </Button>

          <Button
            color="dark"
            style={{marginBottom: '2rem', marginLeft: '1rem'}}
            onClick={() => { this.refreshPrices() }}
          >Refresh Price
          </Button>

          <ListGroup>
            <TransitionGroup className="stock-list">
              {stocks.map(({ _id, name, price}) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <ListGroupItem>
                    <Button
                      className="remove-btn"
                      color="danger"
                      size="sm"
                      onClick = {() => {
                        axios.delete("http://localhost:5000/api/stocks/"+_id)
                        .then(res => {
                          this.setState(state => ({
                            stocks: state.stocks.filter(stock => stock._id !== _id)
                          }));
                        })
                      }}
                    >&times;</Button>
                    {name} | {price}
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>

        </Container>

    )
  }
}

export default StockList;
