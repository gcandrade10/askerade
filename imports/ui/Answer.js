import React, { Component } from "react";
import { Surveys } from "../api/surveys.js";
import ReactDOM from "react-dom";
import Question from "./Question.js";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";


class Answer extends Component 
{	
	constructor(props) {

		super(props); 
		this.state = {
			survey: null,
			numQuestion:0,
		};
	}

  

	updateSurvey()
	{
		Meteor.call("surveys.get", this.props.match.params.number,(err,res)=>{
			if(err)
				throw err;

			this.setState({
				survey: res,
				numQuestion:0,
			});
		});
	}

	registerAnswer(msg)
	{
		const value = msg.target.value;
		this.registerRealAnswer(value);
	}

	registerRealAnswer(value)
	{
		check(value, String);
		const questionIndex=this.state.numQuestion;
		const question_id=this.state.survey.questions[questionIndex]._id;

		const answer = {
			value,
			question_id,
			questionIndex,
		};

		Meteor.call("surveys.addAnswerToQuestion", this.state.survey._id,answer,(err,res)=>{
			if(err)
				throw err;

			this.setState({
				survey: this.state.survey,
				numQuestion: questionIndex+1,
			});
		});
	}




	componentDidMount()
	{
		this.updateSurvey();
	}

	handleSubmit(event){
		event.preventDefault();
		const answer = event.target.children[0].value;
		this.registerRealAnswer(answer);
		event.target.children[0].value="";

	}

	renderquestion(question)
	{
      
		if(question!=null)
		{

			return <Question
				handleSubmit={this.handleSubmit.bind(this)}
				registerAnswer={this.registerAnswer.bind(this)}
				question={question}
				answer={true}
				survey_id={this.state.survey._id}
			/>;
			
		}  
		else
		{
			return <h2>No more questions  </h2>;
		}
	}

	renderSur()
	{
		if(this.state.survey!==null && this.state.survey.active)
		{
			return this.renderquestion(this.state.survey.questions[this.state.numQuestion]);
		}
		return <div><h1>404</h1></div>;
	}

	render()
	{
		return(this.renderSur());
	}
}
export default Answer;
