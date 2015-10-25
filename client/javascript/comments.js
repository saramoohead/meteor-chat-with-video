Template.comments.helpers({
    commentList: function () {
        var currentChallenge = this._id;
        var commentList = Comments.find({ challengeId: currentChallenge }, {sort: { createdAt: -1 } });
        if (commentList) {
            return commentList;
        }
    },
    noCommentsExist: function () {
        var currentChallenge = this._id;
        var commentList = Comments.find({ challengeId: currentChallenge });
        if (commentList.count() === 0) {
            return true;
        }
    },
    featuredComments: function () {
        var currentChallenge = this._id;
        var commentList = Comments.find({ challengeId: currentChallenge, featured: true }, { sort: { createdAt: -1 } });
        if (commentList) {
            return commentList;
        }
    },
    featuredCommentsExist: function () {
        var currentChallenge = this._id;
        var commentList = Comments.find({ challengeId: currentChallenge, featured: true });
        if (commentList.count() > 0) {
            return true;
        }
    },
    createdAtModified: function () {
        var timestamp = this.createdAt;
        if (timestamp) {
            return timestamp.toString().slice(0,10) + " " + timestamp.toString().slice(16,25);
        }
    },
    isOwner: function () {
        var user = Meteor.user();
        if (user && this.owner === Meteor.userId() || user.adminPanel) {
            return true;
        }
    },
    isAdmin: function () {
        var user = Meteor.user();
        if (user && user.adminPanel) {
            return true;
        }
    },
    commenterIsAdmin: function () {
        var commentOwner = this.owner;
        var userLookUp = Meteor.users.findOne(commentOwner);
        if (userLookUp && commentOwner == userLookUp._id && userLookUp.adminPanel) {
            return true;
        }
    },
    isFeatured: function () {
        if (this.featured) {
            return true;
        }
    }
});

Template.comments.events({
    "submit .new-comment": function (event) {
        event.preventDefault();

        var commentText = event.target.commentText.value;
        var currentChallenge = this._id;

        Meteor.call("addComment", commentText, currentChallenge);

        event.target.commentText.value = "";
    },
    "click .delete-button": function () {
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
    },
    "click .feature-button": function () {
        var commentId = this._id;
        Meteor.call("featureCommentToggle", commentId);
    }
});

