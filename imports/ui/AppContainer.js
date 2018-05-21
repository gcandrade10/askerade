import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Surveys } from "../api/surveys.js";
import { Tweets } from "../api/tweetsanswer.js";


import Header from "./Header";
import Search from "./Search";
import Survey from "./Survey.js";
import Answer from "./Answer.js";
import Surveyview from "./Surveyview.js";

class AppContainer extends Component {
	render() {
		return (
			<div>
				<Header />
				<main>
					<Switch>
						<Route exact path="/" render={()=><Search
							tweets={this.props.tweets} 
							user={this.props.user} 
							surveys={this.props.surveys}/>}/>
						<Route path="/survey/:number" component={Survey}/>
						<Route path="/answer/:number" component={Answer}/>
					</Switch>
				</main>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe("surveys");
	Meteor.subscribe("tweets");

	let owner= Meteor.userId();

	return {
		user: Meteor.user(),
		surveys: Surveys.find({owner}, { sort: { createdAt: -1 } }).fetch(),
		tweets: Tweets.find({}, {sort: {date: -1}, limit: 4}).fetch(),

	};

})(AppContainer);
