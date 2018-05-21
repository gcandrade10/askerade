import React, { Component } from 'react';
import { Surveyview } from './Surveyview.js';

export default class SurveysList extends Component {

	renderSurveys() {

		return this.props.surveys.map((survey) => (

			<Surveyview key={survey._id} surveyview={surveyview}/>

		));
		
	}

	render() {

		return (

			<div className="container">
				
				<h1>Surveys done by you v222222</h1>

				<ul>

					{this.renderSurveys()}

				</ul>

			</div>
		);

	}
}
