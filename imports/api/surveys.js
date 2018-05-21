import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Surveys = new Mongo.Collection("surveys");

if (Meteor.isServer) {

	Meteor.publish("surveys", function questionsPublication() {
		return Surveys.find({});
	});
}

if (Meteor.isServer) {
  DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000)
    return 'Try again after ' + time + ' seconds.'
  })

  DDPRateLimiter.addRule({
    type: 'method',
    name: 'surveys.create',
    connectionId () {
      return true
    },
    numRequests: 5,
    timeInterval: 1000
  });

  DDPRateLimiter.addRule({
    type: 'method',
    name: 'surveys.get',
    connectionId () {
      return true
    },
    numRequests: 1,
    timeInterval: 1000
  });

  DDPRateLimiter.addRule({
    type: 'method',
    name: 'surveys.addQuestion',
    connectionId () {
      return true
    },
    numRequests: 1,
    timeInterval: 1000
  });

  DDPRateLimiter.addRule({
    type: 'surveys.addAnswerToQuestion',
    connectionId () {
      return true
    },
    numRequests: 1,
    timeInterval: 1000
  })

  DDPRateLimiter.addRule({
    type: 'surveys.removeQuestion',
    connectionId () {
      return true
    },
    numRequests: 1,
    timeInterval: 1000
  })
}


Meteor.methods({

	"surveys.create"(title,color) {

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
			color,
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
	"surveys.addTweetStream"(_id, codigo){
		check(_id, String);
		return Surveys.update({_id},{$push:{codigo: codigo}});
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
	"survey.countAnswers"(_id){
		check(_id, String);
		let op1 = Surveys.find({$and: [
			{"answers":{$elemMatch:{"value":"op1"}}},
			{_id}
		]}).count();
		let op2 = Surveys.find({$and: [
			{"answers":{$elemMatch:{"value":"op2"}}},
			{_id}
		]}).count();
		let op3 = Surveys.find({$and: [
			{"answers":{$elemMatch:{"value":"op3"}}},
			{_id}
		]}).count();
		let op4 = Surveys.find({$and: [
			{"answers":{$elemMatch:{"value":"op4"}}},
			{_id}
		]}).count();
		let arr = [];
		arr.push(op1);
		arr.push(op2);
		arr.push(op3);
		arr.push(op4);
		return arr;
	},
	"surveys.remove"(_id){
		check(_id, String);
		Surveys.remove({_id});
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
				"questions.$.multiple" : question.multiple,
			} } , 
			false , 
			true);
	}
});