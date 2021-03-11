import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'


class Counter extends Component {
    state = {
        value: this.props.value,
        tags: ['um', 'dois', 'tres']
    };

    render() { 
        return ( 
            <div>
                <Badge variant={this.getBadgeVariant()}> {this.formatCount()}</Badge>
                <button onClick= {() => this.handleIncrement()}> Increment </button>
                <Button onClick={() => this.props.onDelete(this.props.id) } variant="danger m-2"> Delete </Button>
                {this.renderTags()}
            </div> 
            );
    }

    handleIncrement = () =>
    {
        this.setState({value: this.state.value + 1})
    }

    renderTags ()
    {
        if (this.state.tags.length === 0)
            return <p>There are no tags</p>

        return <ul>{this.state.tags.map(tag => <li key={tag}>{tag}</li> )} </ul>
    }

    getBadgeVariant() {
        return (this.state.value === 0) ? "warning" : "primary";
    }

    formatCount(){
        const {value} = this.state;
        return value === 0 ? "Zero" : value;
    }
}
 
export default Counter;