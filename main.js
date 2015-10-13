Comments = new Mongo.Collection("comments");
Challenges = new Mongo.Collection("challenges");

var currentChallenge = 'challenge_1';

Router.route('/', {
    template: 'welcome'
});

Router.route(currentChallenge, {
    name: 'home',
    template: 'home'
});

if (Meteor.isServer) {

    Roles.addUsersToRoles("ya9LFn8jNdiKAGEst", 'super-admin');

}

if (Meteor.isClient) {
    Meteor.subscribe("comments");
    Meteor.subscribe("adminPanelUserData");
    Meteor.subscribe("challenges");

    Template.welcome.helpers({
        adminPanelAccess: function () {
            var user = Meteor.user();
            if (user) {
                return user.adminPanel;
            }
        },
        adminPanelClass: function () {
            if (Session.get("adminPanelStatus") == "admin off" || !Session.get("adminPanelStatus")) {
                return "slideOutUp";
            } else {
                return "slideInDown";
            }
        }
    });

    // if adminPanelOn (true or false)
    // set Session as false to begin
    // make a Session helper, for various events

    Template.welcome.events({
        "click .admin-button": function(){
            if (!Session.get("adminPanelStatus")) {
                Session.set("adminPanelStatus", "admin on");
            } else if (Session.get("adminPanelStatus") == "admin off") {
                Session.set("adminPanelStatus", "admin on");
            } else {
                Session.set("adminPanelStatus", "admin off");
            }
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

    Meteor.users.deny({
        update: function() {
            return true;
        }
    });
}

Meteor.methods({
    addComment: function (commentText) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Comments.insert({
            commentText: commentText,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteComment: function (commentId) {
        Comments.remove(commentId);
    },
    addChallenge: function (challengeDate, challengeTitle, challengeDescription, challengeVideoLink) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Challenges.insert({
            challengeDate: challengeDate,
            challengeTitle: challengeTitle,
            challengeDescription: challengeDescription,
            challengeVideoLink: challengeVideoLink,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });

        Meteor.subscribe();
    },
    deleteChallenge: function (challengeId) {
        Challenges.remove(challengeId);
    },
});
