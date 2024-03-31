import { Component } from 'react';
import CalculatorButton from './CalculatorButton';
import './App.css';
import { evaluate } from 'mathjs';


class Calculator extends Component {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {
            buttons: [
                {
                    id: "clear",
                    value: null,
                    operation: null,
                    class: "wide clear",
                },
                {
                    id: "divide",
                    value: null,
                    operation: "/",
                    class: "operand",
                },
                {
                    id: "multiply",
                    value: null,
                    operation: "*",
                    class: "operand",
                },
                {
                    id: "seven",
                    value: "7",
                    operation: null,
                },
                {
                    id: "eight",
                    value: "8",
                    operation: null,
                },
                {
                    id: "nine",
                    value: "9",
                    operation: null,
                },
                {
                    id: "add",
                    value: null,
                    operation: "+",
                    class: "operand",
                },
                {
                    id: "four",
                    value: "4",
                    operation: null,
                },
                {
                    id: "five",
                    value: "5",
                    operation: null,
                },
                {
                    id: "six",
                    value: "6",
                    operation: null,
                },
                {
                    id: "subtract",
                    value: null,
                    operation: "-",
                    class: "operand",
                },
                {
                    id: "one",
                    value: "1",
                    operation: null,
                },
                {
                    id: "two",
                    value: "2",
                    operation: null,
                },
                {
                    id: "three",
                    value: "3",
                    operation: null,
                },
                {
                    id: "zero",
                    value: "0",
                    operation: null,
                    class: "wide zero",
                },
                {
                    id: "decimal",
                    value: null,
                    operation: ".",
                },
                {
                    id: "equals",
                    value: null,
                    operation: "=",
                    class: "tall equals",
                },
            ],
            input: "",
            output: "",
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    };

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleExpression(buttonId) {
        const i = this.state.buttons.findIndex(btn => btn.id === buttonId);
        const pressedBtn = this.state.buttons[i];

        console.log(buttonId, i, pressedBtn)

        // Handle clear button
        if (!pressedBtn?.value && !pressedBtn?.operation) {
            this.setState({
                input: "",
                output: "",
            });
            return;
        }

        let currentInput = this.state.input;
        let newInput = currentInput;
        let currentOutput = this.state.output
        let newOutput = currentOutput;

        if (!currentOutput && pressedBtn.operation !== "=") {
            // From fresh, anything is fine
            newInput = pressedBtn.operation || pressedBtn.value;
            newOutput = pressedBtn.operation || pressedBtn.value;
        } else if (pressedBtn.operation === "=" && currentInput.split("").every(char => this.isOperation(char))) {
            // Pressing "=" with no numbers having been pressed should result in nothing happening.
            return;
        } else {
            if (pressedBtn.operation) {
                if (pressedBtn.operation === "." && currentOutput.includes(".")) {
                    // Don't add extra decimals
                    newInput = currentInput;
                    newOutput = currentOutput;
                } else {
                    if (this.isOperation(currentInput.slice(-1))) {
                        // Last charater was an operand
                        newOutput = pressedBtn.operation;
                        // Allow double negative, replace if else
                        if (pressedBtn.operation === "-" && currentInput.slice(-1) === "-") {
                            newInput = currentInput.includes("--") ? currentInput : currentInput + pressedBtn.operation
                        } else if (pressedBtn.operation === "-" && ["*", "/", "+"].includes(currentInput.slice(-1))) {
                            newInput += pressedBtn.operation;
                        } else {
                            const operandPos = currentInput.split("").findIndex(char => this.isOperation(char));
                            newInput = newInput.slice(0, operandPos);
                            newInput += pressedBtn.operation;
                        }
                    } else {
                        // Last character was a number
                        if (pressedBtn.operation === "=") {
                            // Don't evaluate if "*" or "/" is the first character
                            if (newInput.slice(0, 1) !== "/" && newInput.slice(0, 1) !== "*") {
                                let solution = evaluate(newInput);
                                // if (solution.includes(".")) {
                                //     // set maximum decimal precision
                                // } else {
                                //     // use scientific notiation if beyond character limit
                                // }
                                // // old setup
                                newOutput = solution
                                newInput += pressedBtn.operation + solution;
                            }
                        } else if (currentInput.includes("=")) {
                            // Pressed an operation after evaluating
                            newInput = currentOutput + pressedBtn.operation;
                            newOutput = pressedBtn.operation;
                        } else {
                            newInput += pressedBtn.operation;
                            newOutput = pressedBtn.operation === "." ? newOutput + pressedBtn.operation : pressedBtn.operation;
                        }
                    }
                }
            } else if (!(pressedBtn.value === "0" && currentInput === "0")) {
                // Pressed a number
                // Don't allow multiple zeroes at begging of expression
                if (currentInput.includes("=")) {
                    // Pressed a number after evaluating
                    newInput = pressedBtn.value;
                    newOutput = pressedBtn.value;
                } else {
                    newInput += pressedBtn.value;
                    if (this.isOperation(currentOutput.slice(-1))) {
                        newOutput = pressedBtn.value;
                    } else {
                        newOutput += pressedBtn.value;
                    }
                }
            }
        }

        this.setState({
            input: newInput,
            output: newOutput,
        });
    }

    isOperation(currentOutput) {
        const operations = ["+", "-", "*", "/", "="];
        // console.log("[ isOperation ]", currentOutput, !isNaN(operations.find(op => op === currentOutput)))
        return !!operations.find(op => op === currentOutput);
    }

    handleKeyDown(e) {
        if (e.repeat) return;
        if (e.keyCode === 13) {
            this.handleExpression("equals");
            return;
        }
        if (e.keyCode === 27) {
            this.handleExpression("clear");
            return;
        }
        const btn = this.state.buttons.find(btn => {
            let key = e.key.toLowerCase();
            return btn.value === key || btn.operation === key;
        });

        if (!btn) return;

        this.handleExpression(btn.id);
    }

    render() {
        return (
            <div className="calculator">
                <div className="display-area">
                    <div className="display-output">{this.state.input}</div>
                    <div id="display" className="display-input">{this.state.output || "0"}</div>
                </div>
                {this.state.buttons.map((button, index) => {
                    return <CalculatorButton
                        id={button.id}
                        value={button.value}
                        operation={button.operation}
                        class={button.class}
                        key={index}
                        handleExpression={this.handleExpression.bind(this)}
                    />
                })}
            </div>
        );
    }
}

export default Calculator;
