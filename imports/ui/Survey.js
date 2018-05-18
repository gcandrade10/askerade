import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import Question from "./Question.js";
import swal from "sweetalert";
import renderHTML from "react-render-html";
import MyStatefulEditor from "./MyStatefulEditor.js";



class Survey extends Component 
{	
	constructor(props) {
		super(props); 
		this.state = {
			survey: null,
			editting:null,
			multiple:true,
			tweets:[]
		};
	}

	updateSurvey()
	{
		this.id = this.props.id || this.props.match.params.number;
		Meteor.call("surveys.get", this.id,(err,res)=>{
			if(err)
				throw err;
			this.modifyState("survey",res);


		});
	}


	removeQuestion(event)
	{
		event.preventDefault();
		let question = this.state.survey.questions[event.target.value];
		Meteor.call("surveys.removeQuestion",this.state.survey._id,question,(err,res)=>{
			if(err)
				throw err;
			
			swal("deleted ");
			this.updateSurvey();
		});
	}

	modifyState(name,value)
	{
		this.setState(() => ({
			[name]: value
		}));
	}

	editQuestion(event)
	{
		event.preventDefault();	
		let question = this.state.survey.questions[event.target.value];
		this.fillFormQuestion(question);
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
		this.modifyState("editting",question._id);
	}


	componentDidMount()
	{
		this.updateSurvey();
	}

	handleSubmit(event){
		event.preventDefault();
		this.top.scrollIntoView({ behavior: "smooth" });


		const title = ReactDOM.findDOMNode(this.refs.title).value.trim();
		const multiple = this.state.multiple;
		const _id= this.state.editting||new Date().getTime().toString();
		const color = this.state.survey.color;

		var question = {
			title,
			multiple,
			_id
		};


		if(this.state.multiple)
		{
			const op1 = ReactDOM.findDOMNode(this.refs.op1).value.trim();
			const op2 = ReactDOM.findDOMNode(this.refs.op2).value.trim();
			const op3 = ReactDOM.findDOMNode(this.refs.op3).value.trim();
			const op4 = ReactDOM.findDOMNode(this.refs.op4).value.trim();
			question = {
				title,
				multiple,
				op1,
				op2,
				op3,
				op4,
				_id,
				color,
			};
		}



		if(this.state.editting!==null)
		{
			Meteor.call("surveys.updateQuestion", this.state.survey._id,question,(err,res)=>{
				if(err)
					throw err;

				this.modifyState("editting",null);

				this.fillForm("","","","","","");
				this.updateSurvey();
			});
		}
		else
		{
			Meteor.call("surveys.addQuestion", this.state.survey._id,question,(err,res)=>{
				if(err)
					throw err;
				this.fillForm("","","","","","");

				this.updateSurvey();
			});
		}
		this.top.scrollIntoView({ behavior: "smooth" });

	}

	fillForm(title, op1, op2, op3, op4)
	{
		ReactDOM.findDOMNode(this.refs.title).value = title;
		if(ReactDOM.findDOMNode(this.refs.op1)!=null)
		{
			ReactDOM.findDOMNode(this.refs.op2).value = op2;
			ReactDOM.findDOMNode(this.refs.op3).value = op3;
			ReactDOM.findDOMNode(this.refs.op1).value = op1;
			ReactDOM.findDOMNode(this.refs.op4).value = op4;
		}
	}

	fillFormQuestion(question)
	{
		this.fillForm(question.title, question.op1, question.op2, question.op3, question.op4);
	}


	renderquestions(questions)
	{
		let reverseQuestions=questions.reverse();
		return reverseQuestions.map((question,index) => {
			return  <Question
				editQuestion={this.editQuestion.bind(this)}
				removeQuestion={this.removeQuestion.bind(this)}
				key={question.toString().concat(index)}
				question={question}
				index={index}
				survey_id={this.state.survey._id}
				color={this.state.survey.color}
			/>;
		});
	}

	changeQuery() {
		const active = ReactDOM.findDOMNode(this.refs.active).checked;
		Meteor.call("surveys.changeActive",this.state.survey._id,active);
	}

	changeMultiple() {
		const multiple = ReactDOM.findDOMNode(this.refs.multiple).checked;
		this.modifyState("multiple",multiple);


	}
	isChecked(){
		return this.state.survey.active?"defaultChecked":"";
	}

	rendeResultsButton()
	{
		return( 
			<button 
				onClick={this.props.results}
				data-index={this.props.index}
				value={this.id}
				className="btn btn-primary"
			>
			Results
			</button>
		);
	}

	share()
	{
		if(!ReactDOM.findDOMNode(this.refs.active).checked)
		{
			swal("Please activate the survey to share it");
		}
		else
		{
			swal("/answer/"+this.id);
		}
	}

	rendeShareButton()
	{
		return( 
			<button 
				onClick={this.share.bind(this)}
				value={this.id}
				className="btn btn-primary"
			>
			Share
			</button>
		);
	}

	renderInput()
	{
		if(this.state.survey.active)
		{
			return( 
				<input 
					ref="active"
					type="checkbox" 
					onChange={this.changeQuery.bind(this)}
					defaultChecked
				/>);
		}
		else
		{
			return( 
				<input 
					ref="active"
					type="checkbox" 
					onChange={this.changeQuery.bind(this)}
				/>);
		}
	}

	renderConfigMenu()
	{
		return(
			<div className="row">
				<div className="col-md-3" ></div>
				<div className="col-md-3" >
					<h2>Active</h2>
				</div>
				<div className="col-md-3" >
					<label className="switch">
						{this.renderInput()}
						<span className="slider round"></span>
					</label>
				</div>
				<div className="col-md-3" ></div>
			</div>
		);
	}


	renderConfigQuestion()
	{
		return(
			<div className="row">
				<div className="col-md-3" ></div>
				<div className="col-md-3" >
					<h3>Multiple choice</h3>
				</div>
				<div className="col-md-3" >
					<label className="switch">
						<input 
							ref="multiple"
							type="checkbox" 
							onChange={this.changeMultiple.bind(this)}
							defaultChecked
						/>
						<span className="slider round"></span>

					</label>
				</div>
				<div className="col-md-3" ></div>
			</div>
		);
	}

	renderOptions()
	{
		if(this.state.multiple)
		{
			return(
				<div className="container">
					<h2>Answers:</h2>
					<div className="row" >
						<div className="col-md-6 border" >
							<div className="form-group">
								<input
									className="form-control"
									type="text"
									ref="op1"
									placeholder="Type the option 1"
								/>            
							</div>
						</div>
						<div className="col-md-6 border" >
							<div className="form-group">
								<input
									className="form-control"
									type="text"
									ref="op2"
									placeholder="Type the option 2"
								/>            
							</div>
						</div>
					</div>
					<div className="row" >
						<div className="col-md-6 border" >
							<div className="form-group">
								<input
									className="form-control"
									type="text"
									ref="op3"
									placeholder="Type the option 3"
								/>            
							</div>
						</div>
						<div className="col-md-6 border" >
							<div className="form-group">
								<input
									className="form-control"
									type="text"
									ref="op4"
									placeholder="Type the option 4"
								/>            
							</div>
						</div>
					</div>
				</div>
			);
		}
	}

	onChange(value) {
   	 ReactDOM.findDOMNode(this.refs.title).value = value;
 	}

	renderSur()
	{
		if(this.state.survey!==null && this.state.survey.owner ===Meteor.userId())
		{
			const q = this.state.survey.questions;
			return<div 
				className="container survey-cont" 
				style={{"backgroundColor": this.state.survey.color}}>
				<h1
					ref={(el) => { this.top = el; }}
				>
					{renderHTML(this.state.survey.title)}
				</h1>
				<br/>
				{this.rendeResultsButton()}
				{this.rendeShareButton()}
				<br/>
				<br/>
				{this.renderConfigMenu()}

				{this.renderquestions(q)}

				<br/>
				<br/>
				<br/>
				<div className="container new-question-form">
				<h2 className="title-add-question"><strong>Add another question!</strong></h2>
					<hr/>
					{this.renderConfigQuestion()}
					<form 
						className="new-question"
						ref={(el) => { this.messagesEnd = el; }}
						onSubmit={this.handleSubmit.bind(this)}>
						<div className="card mx-auto"  >
							<div className="card-body" >

								<div className="form-group card-title">
									<input
										className="form-control text-center"
										type="text"
										ref="title"
										placeholder="Type the question"
										required
										hidden
									/> 
									<h2>Question:</h2>       
									<MyStatefulEditor onChange={this.onChange.bind(this)}/>    
								</div>

								

								{this.renderOptions()}

								
							</div>
						</div>

						<input
							className="btn btn-submit btn-add-question"
							type="submit"
							value={this.state.editting?"Update question":"Add question"}
						/>
					</form>  
				</div>
			</div>;
		}
		return <div>404</div>;
	}

	render()
	{
		return(this.renderSur());
	}
}
export default Survey;
