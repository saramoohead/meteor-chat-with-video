Comments = new Mongo.Collection("comments");

if (Meteor.isServer) {
    Meteor.publish("comments", function () {
        return Comments.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe("comments");

    Template.comments.helpers({
        commentList: function () {
            return Comments.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.deleteComments.helpers({
        userCheck: function () {
        var thisCommentOwner = Comments.findOne(this._id).owner;
            if (Meteor.userId() == thisCommentOwner) {
                return true;
            } else {
                return false;
            }
        }
    });

    Template.body.events({
        "submit .new-comment": function (event) {
            event.preventDefault();

            var commentText = event.target.commentText.value;

            Meteor.call("addComment", commentText);

            event.target.commentText.value = "";
        },

        "click .delete": function () {
            var commentId = this._id;

            swal({
                title: "Delete comment?",
                type: "warning",
                text: "You can't get it back once it's gone.",
                confirmButtonText: "Delete",
                showCancelButton: true,
                allowOutsideClick: true
            },
            function(response){
                if (response === true) {
                    Meteor.call("deleteComment", this._id);
                    swal("Deleted!", "Comment deleted.", "success");
                } else {
                }
            });
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
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
    }
});
