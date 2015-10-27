Comments = new Mongo.Collection('comments');
Challenges = new Mongo.Collection('challenges');

Router.route('/', {
    template: 'welcome'
});

Router.route('/admin', {
    template: 'adminPanel'
});

Router.route('live', {
    template: 'challenge',
    data: function(){
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var comparableDate = year + "-" + month + "-" + day;

        var liveChallenge = Challenges.findOne(
            { challengeDate: { $lte: comparableDate } },
            { sort: { challengeDate: -1 } }
        );
        return liveChallenge;
    }
});

Router.route('/challenge/:_id', {
    template: 'challenge',
    data: function(){
        var clickedChallenge = this.params._id;
        return Challenges.findOne({ _id: clickedChallenge });
    }
});


if (Meteor.isServer) {

    SyncedCron.add({
        name: 'GoRoost new video notification',
        schedule: function(parser) {
            return parser.text('at 9:00 am on Mon');
        },
        job: function() {
            // console.log("********insideSyncedCronAdd");
            Meteor.call("sendGoroostNotification");
        }
    });

    Meteor.startup(function () {
        SyncedCron.start();
        // not sure if I need to include a stop?
    });

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

    Template.welcome.events({
        "click .admin-button": function(){
            if (!Session.get("adminPanelStatus")) {
                Session.set("adminPanelStatus", "admin on");
            } else if (Session.get("adminPanelStatus") == "admin off") {
                Session.set("adminPanelStatus", "admin on");
            } else {
                Session.set("adminPanelStatus", "admin off");
            }
        },
        "click .inspire": function(){
            document.getElementById("welcome").className="container slideUpOut";
            _roost.prompt();
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

