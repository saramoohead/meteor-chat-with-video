Comments = new Mongo.Collection("comments");
Videos = new Mongo.Collection("videos");
Challenges = new Mongo.Collection("challenges");

Router.route('/', {
    template: 'welcome'
});

Router.route('/challenge_1', {
    name: 'home',
    template: 'home'
});

if (Meteor.isServer) {

    Roles.addUsersToRoles("ya9LFn8jNdiKAGEst", 'super-admin');

}

if (Meteor.isClient) {
    Meteor.subscribe("comments");
    Meteor.subscribe("adminPanelUserData");
    Meteor.subscribe("videos");
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
    addVideo: function (videoLink) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Videos.insert({
            videoLink: videoLink,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        Meteor.subscribe();
    },
    addChallenge: function (challengeDate, challengeTitle, challengeDescription) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Challenges.insert({
            challengeDate: challengeDate,
            challengeTitle: challengeTitle,
            challengeDescription: challengeDescription,
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
