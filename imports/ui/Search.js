import React, { Component } from "react";
import queryString from "query-string";
import ReactDOM from "react-dom";
import { Surveys } from "../api/surveys.js";
import MyStatefulEditor from "./MyStatefulEditor.js";
import Surveyview from "./Surveyview.js";
import Survey from "./Survey.js";
import Result from "./Result.js";
import RichTextEditor from "react-rte";
import ColorSelect from "./ColorSelect.js";

class Search extends Component 
{	
	constructor(props) {
		super(props); 
		let title = RichTextEditor.createValueFromString("", "html");
		this.state = {
			colorSurvey: "#FFFFFF",
			clear:false,
			title
		};
	}

	modifyState(name,value)
	{
		this.setState(() => ({
			[name]: value
		}));
	}

	details(event)
	{
		event.preventDefault();
		let index = event.target.attributes.getNamedItem("data-index").value;
		this.modifyState("id", event.target.value);
		this.modifyState("index", index);
		this.modifyState("detail", true);
	}

	remove(event)
	{
		event.preventDefault();
		let id= event.target.value;
		Meteor.call("surveys.remove", id);
	}


	results(event)
	{
		event.preventDefault();
		this.modifyState("id", event.target.value);
		this.modifyState("result", true);
		this.modifyState("detail", false);
		let index = event.target.attributes.getNamedItem("data-index").value;
		this.modifyState("index", index);

	}

	renderSurveys() {
		return this.props.surveys.map((surveyview,i) => (
			<Surveyview 
				key={surveyview._id} 
				survey={surveyview} 
				details={this.details.bind(this)} 
				remove={this.remove.bind(this)} 
				index={i} />
		));
	}

	handleSubmit(event){
		event.preventDefault();
		let  title = this.state.title.toString("html");
		Meteor.call("surveys.create", title, this.state.surveyColor);
		this.top.scrollIntoView({ behavior: "smooth" });
		
		title = RichTextEditor.createValueFromString("", "html");
		this.modifyState("title",title);
	}	

	onChange(value) {
		this.modifyState("title",value);
		ReactDOM.findDOMNode(this.refs.title).value = value.toString("html");
	}

	onChangeColor(color) {
		this.setState({
			surveyColor: color.hex
		});
	}

	render() {
		if (this.state.detail) {
			return <Survey
				tweets={this.props.tweets}
				id={this.state.id} 
				results={this.results.bind(this)} 
				index={this.state.index}/>;
		}
		if (this.state.result) {
			return <Result 
				survey={this.props.surveys[this.state.index]} 
				id={this.state.id}/>;
		}
		return (
			<div className="container">
				<h1
					ref={(el) => { this.top = el; }}
				>Surveys done by you </h1>
				<ul>
					{this.renderSurveys()}
				</ul>
				{this.props.user ? (
					<div>
						<h2>Add a Survey!</h2>
						<form className="new-question" onSubmit={this.handleSubmit.bind(this)}>
							<div className="form-group">
								<input
									className="form-control"
									type="text"
									ref="title"
									placeholder="Type the title of the Survey"
									required
									hidden
								/>

								<MyStatefulEditor onChange={this.onChange.bind(this)} title={this.state.title}/>            
							</div>
							
							<ColorSelect 
								color={this.state.colorSurvey} 
								onChangeComplete={this.onChangeColor.bind(this)} 
							/>

							<input
								className="btn btn-submit"
								type="submit"
								placeholder="Add question"
							/>
						</form></div>) : ""
				}

			</div>
		);
	}

}

export default Search;
