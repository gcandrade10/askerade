import Twitter from "twitter";
import {Meteor} from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";


// TODO: Now we have only one stream overall,
// we should have one per user at least
let stream = null;
let lastQuery = null;
let stop=false;

// This is a in memory only collection
export const Tweets = new Mongo.Collection("tweets");


// Twitter streamer should run only on the server
if (Meteor.isServer) {
	Meteor.publish("tweets", function tweetsPublication() {
		return Tweets.find({}, {sort: {created_at: -1}, limit:10});
	});

	// This method will trigger the streamer
	Meteor.methods({
		"twitter.remove"(_id) {
			check(_id, String);
			Tweets.remove({_id});
		},
		"twitter.stop"() {
			stop=true;
			if (stream ) {
				console.log("Stopping previous stream");
				stream.destroy();
			}
		},
		"twitter.stream"(query) {
			stop=false;
			console.log("Twitter search " + query);
			lastQuery=query;
			// Create the Twitter object
			let client = new Twitter({
				consumer_key:"8tt6uX5iqu1fVmBBMrkGCBMwL",
				consumer_secret: "QKjw2Wl1FQkKhqLExXQKhy9bCIplTEeV7ywkvhJ3O3rmg77nVJ",
				access_token_key: "97156244-xqqkT9oBsulivxznBehM1V142MOvpirruZ3PylQX4",
				access_token_secret: "0HiksTO0ECE2KgBfrClk08IrVISQfp3Y1yGszWyEeLHJL"
            
			});

			if (stream && lastQuery!==query) {
				console.log("Stopping previous stream");
				stream.destroy();
				// Remove all the tweets
				Tweets.remove({});
			}

			stream = client.stream("statuses/filter", {track: query});
			stream.on("data", Meteor.bindEnvironment(function(tweet) {
				if(!stop)
				{
					console.log(tweet);
					Tweets.insert(tweet);
				}
			}));

			stream.on("error", function(error) {
				console.log(error);
				throw Meteor.Error(error);
			});
			lastQuery=query;
		}// twitter.stream
	}); //Meteor.methods
}
