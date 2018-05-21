import React, { Component } from "react";
import { Surveys } from "../api/surveys.js";
import marked from "marked";

export default class Surveyview extends Component {

	constructor(props)
	{
		super(props);
		this.state = {
			showDetails: false,
		};
	}
	render() {
		return (
			<li className="survey-list">
				<p dangerouslySetInnerHTML={{__html: marked(this.props.survey.title)}} />

				<br/>

				<div className="container">
					<div className="row">
						<div className="col-md-3"></div>
						<div className="col-md-3">

							<button 
								value={this.props.survey._id}
								data-index={this.props.index}
								className="btn btn-primary"
								onClick={this.props.details}
							>Details
							</button>
						</div>
						<div className="col-md-3">
							<button 
								value={this.props.survey._id}
								className="btn btn-primary"
								onClick={this.props.remove}
							>Remove
							</button>
						</div>
						<div className="col-md-3"></div>
					</div>
				</div>

				

			</li>

		);

	}

}
