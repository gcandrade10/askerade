import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Surveys = new Mongo.Collection("surveys");

if (Meteor.isServer) {

	Meteor.publish("surveys", function questionsPublication() {
		return Surveys.find({});
	});
}

Meteor.methods({

	"surveys.create"(title) {

		check(title, String);

		if(title==="") {

			throw new Meteor.Error("Empty field");

		}

		if (! this.userId) {

			throw new Meteor.Error("not-authorized");

		}

		return Surveys.insert({
			active:false,
			owner:this.userId,
			title,
			createdAt: new Date(),
			questions: [],
			answers: [],
		});

	},

	"surveys.get"(_id) {
		check(_id, String);
		return Surveys.findOne({_id});
	},

	"surveys.addQuestion"(_id, question) {
		check(_id, String);
		check(question.title, String);

		if(question.title==="") {
			throw new Meteor.Error("Empty field");
		}

		if (! this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		return Surveys.update({_id},{$push:{questions: question}});
	},

	"surveys.addAnswerToQuestion"(_id,  answer) {
		check(_id, String);
		return Surveys.update({_id},{$push:{answers: answer}});
	},

	"surveys.changeActive"(_id, active){
		check(_id, String);
		check(active, Boolean);
		return Surveys.update({_id},{$set: {active} });	
	},
	"surveys.removeQuestion"(_id,question){
		check(_id, String);
		check(question, Object);
		return Surveys.update({_id},{$pull:{questions: question}});
	},
	"surveys.updateQuestion"(_id,question){
		check(_id, String);
		check(question, Object);
		return Surveys.update( {_id, "questions._id" : question._id } , 
			{$set : {
				"questions.$.title" : question.title,
				"questions.$.op1" : question.op1,
				"questions.$.op2" : question.op2,
				"questions.$.op3" : question.op3,
				"questions.$.op4" : question.op4,
			} } , 
			false , 
			true);
	}
});