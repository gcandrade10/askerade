import React, { Component } from "react";

export default class RealAnswer extends Component {
	render() {
		return (
			<div className="card text-white bg-primary mb-3" >
				<div className="card-body">
					<p className="card-text">{this.props.value}</p>
				</div>
			</div>
		);
	}
}
