import { Component } from 'react';
import './App.css';

class CalculatorButton extends Component {
    onClickButton() {
        this.props.handleExpression(this.props.id);
    }

    render() {
        const classes = `calculator-button` + (!!this.props.class ? ` ${this.props.class}` : '');
        return (
            <button id={this.props.id} className={classes} onClick={this.onClickButton.bind(this)}>
                {this.props.value || this.props.operation || "AC"}
            </button>
        );
    }
}

export default CalculatorButton;
