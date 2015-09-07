Template.comments.helpers({
    commentList: function () {
        var commentList = Comments.find({}, {sort: {createdAt: -1}});
        if (commentList) {
            return commentList;
        }
    },
    createdAtModified: function () {
        var timestamp = this.createdAt;
        return timestamp.toString().slice(15,25);
    },
    isOwner: function () {
        var user = Meteor.user();
        if (user) {
            if (this.owner === Meteor.userId() || user.adminPanel) {
                return true;
            }
        }
    },
    isAdmin: function () {
        var commentOwner = this.owner;
        var userLookUp = Meteor.users.findOne(commentOwner);
        if (userLookUp) {
            if (commentOwner == userLookUp._id && userLookUp.adminPanel) {
                return true;
            }
        }
    }
});

Template.comments.events({
    "submit .new-comment": function (event) {
        event.preventDefault();

        var commentText = event.target.commentText.value;

        Meteor.call("addComment", commentText);

        event.target.commentText.value = "";
    },
    "click .delete-comment": function () {
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
                Meteor.call("deleteComment", commentId);
                swal("Deleted!", "Comment deleted.", "success");
            } else {
            }
        });
    }
});

