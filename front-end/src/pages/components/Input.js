import React from "react";

class Input extends React.Component {
    render() {
        return (
            <div className="input_container">
                <div className="input">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                    <input 
                        disabled={this.props.disabled}
                        type={this.props.type} 
                        id={this.props.id} 
                        value={this.props.value}
                        onChange={this.props.changeHandler}
                    />
                </div>
                <div className="error">
                    {this.props.error && (<p>{this.props.error}</p>)}
                </div>
            </div>
        )
    }
}

export default Input