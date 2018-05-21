import React, { Component } from "react";
import { TweetsList } from "./TweetsList.js";
import ReactDOM from "react-dom";


export default class QuestionFinder extends Component {
	handleSubmit(event)
	{
		event.preventDefault();
		const codigo = ReactDOM.findDOMNode(this.refs.tweet).value.trim();
		console.log(codigo);
		this.props.handleSubmit(codigo);
	}
	render() {
		return (<div>
			<form 
				onSubmit={this.handleSubmit.bind(this)}
				className="form-group">
				<div className="form-row">
					<input
						className="form-control"
						ref="tweet"
						type="text"
						placeholder="Hashtag to search"
					/>
				</div>
				<input 
					vale="Search"
					className="btn btn-submit"
					type="submit"							
				/>
			</form>
			<button
				className="btn btn-danger"
				onClick={this.props.stop}
			>Stop</button>

			<TweetsList
				removeTweet={this.props.removeTweet}
				useTweet={this.props.useTweet}
				tweets={this.props.tweets}
			/>
		</div>);
	}
}
