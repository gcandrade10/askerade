import React, { Component } from "react";
import ReactDOM from "react-dom";
import renderHTML from "react-render-html";
import { Meteor } from "meteor/meteor";
import {PropTypes} from "prop-types";

import { withTracker } from "meteor/react-meteor-data";
import QuestionFinder  from "./QuestionFinder.js";


export default class Question extends Component 
{
	constructor(props){
		super(props);
		this.state={
			tweets:[],
		};
	}
	

	render()
	{
		return (
			<div className="card mx-auto question-cont" style={{"backgroundColor": this.props.question.color}}  >
				<div className="card-body" >
					<div className="card-title" >{renderHTML(this.props.question.title)} </div>
					<div className="container" >
						{this.renderOptions()}
					</div>
				</div>
			</div>
		);  
	}
	renderOption(option,label)
	{
		return(
			<div className="container" >
				<button
					data-toggle="list" 
					className="list-group-item list-group-item-action btn-opcion"
					onClick={this.props.registerAnswer} 
					type="button" 
					value={label}>
					{option}
				</button>
			</div>
		);
	}
	renderButtons()
	{
		return(
			<div className="row" >
				<br/>
				<div className="col-md-4"> </div>
				<div className="col-md-2 " >
					<button
						value={this.props.index}
						onClick={this.props.removeQuestion} 
						className="btn btn-danger">
						Remove</button></div>
				<div className="col-md-2" >
					<button
						value={this.props.index}
						onClick={this.props.editQuestion} 
						className="btn btn-primary">
						Edit </button></div>
			</div>
		);
	}

	renderQuestion()
	{
		if(this.props.question.multiple)
		{
			return(
				<div>
					<div className="row" >
						<div className="col-md-6 list-group-item list-group-item-action" >{this.props.question.op1}</div>
						<div className="col-md-6 list-group-item list-group-item-action" >{this.props.question.op2}</div>
					</div>
					<div className="row" >
						<div className="col-md-6 list-group-item list-group-item-action" >{this.props.question.op3}</div>
						<div className="col-md-6 list-group-item list-group-item-action" >{this.props.question.op4}</div>
					</div>
				</div>
			);
		}
	}

	renderOptions()
	{
		if(!this.props.answer)
		{
			return(
				<div>
					{this.renderQuestion()}
					{this.renderButtons()}

				</div>
			);
		}
		else if(this.props.question.multiple && this.props.answer)
		{
			return(
				<div style={{"backgroundColor": this.props.question.color}}>
					<div className="row" >
						
						{this.renderOption(this.props.question.op1,"op1")}
						{this.renderOption(this.props.question.op2,"op2")}						
					</div>
					<div className="row" >
						{this.renderOption(this.props.question.op3,"op3")}
						{this.renderOption(this.props.question.op4,"op4")}
					</div>
				</div>
			);
		}

		else if(this.props.answer)
		{
			return(
				<div>
					
					<form 
						onSubmit={this.props.handleSubmit}
					>
						<textarea 
							maxlength="1000"
							placeholder="Answer here"
							type="text"
							ref="answer"
							rows="4" 
							cols="50" 
							name="comment" 
							form="usrform">

						</textarea>         

						<input
							className="btn btn-submit"
							type="submit"
							value="send"
						/>

					</form> 
				</div>
			);
		}
	}	
}