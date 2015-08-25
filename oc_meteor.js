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
                    Comments.remove(commentId);
                    swal("Deleted!", "Comment deleted.", "success");
                } else {
                }
            });
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
