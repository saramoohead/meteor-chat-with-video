Template.comments.helpers({
    commentList: function () {
        return Comments.find({}, {sort: {createdAt: -1}});
    },
    isOwner: function () {
        var user = Meteor.user();
        if (user) {
            if (this.owner === Meteor.userId() || user.adminPanel) {
                return true;
            }
        }
    },
    adminClass: function () {
        var commentOwner = this.owner;
        var userLookUp = Meteor.users.findOne(commentOwner);
        if (commentOwner == userLookUp._id && userLookUp.adminPanel) {
            console.log("*** step 2");
            return "admin-class";
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

