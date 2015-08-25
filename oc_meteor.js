Comments = new Mongo.Collection("comments");

if (Meteor.isClient) {

    Template.comments.helpers({
        commentList: function () {
            return Comments.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.body.events({
        "submit .new-comment": function (event) {
            event.preventDefault();

            var commentText = event.target.commentText.value;

            Comments.insert({
                commentText: commentText,
                createdAt: new Date()
            });

            event.target.commentText.value = "";
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
