import React, { Component } from 'react';
import Counter from './counter'

class Counters extends Component {
    state = {
        counters: [
           {id: 1, value: 4},
           {id: 2, value: 0},
           {id: 3, value: 0},
           {id: 4, value: 0},
        ]
      }
    render() { 
        return (<div>
            {this.state.counters.map(counter => 
            <Counter onDelete={this.handleDelete} key = {counter.id} id = {counter.id} value={counter.value}>
            </Counter>
            )}
        </div>);
    }

    handleDelete = (counterId) => {
        console.log(counterId)
        const counters = this.state.counters.filter(c => c.id !== counterId);
        this.setState({counters})
    }
}
 
export default Counters;