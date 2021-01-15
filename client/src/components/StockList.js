import React, {Component} from 'react';
import {Container, ListGroup, ListGroupItem, Button} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {v1 as uuid} from 'uuid/';
import axios from 'axios';

class StockList extends Component {
  state = {
    stocks: []
  }

  componentDidMount(){
    axios.get('http://localhost:5000/api/stocks')
      .then(res => {
        this.setState({stocks: res.data});
        console.log(this.state.stocks);
      });
  }

  render() {
    const {stocks} = this.state;
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

      <ListGroup>
        <TransitionGroup className="stock-list">
          {stocks.map(({ _id, name }) => (
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
                {name}
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
