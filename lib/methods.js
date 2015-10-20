Meteor.methods({
    addComment: function (commentText, currentChallenge) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Comments.insert({
            commentText: commentText,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            featured: false,
            challengeId: currentChallenge
        });
    },
    deleteComment: function (commentId) {
        Comments.remove(commentId);
    },
    featureCommentToggle: function (commentId) {
        var thisComment = Comments.findOne({ _id: commentId });
        if (thisComment.featured) {
            Comments.update(commentId, { $set: { featured: false } });
        } else {
            Comments.update(commentId, { $set: { featured: true } });
        }
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
    },
    deleteChallenge: function (challengeId) {
        Challenges.remove(challengeId);
    },
    addAdmin: function (userName) {
        Meteor.users.update({ username: userName }, { $set: { adminPanel: true } });
    },
    deleteAdmin: function (userId) {
        Meteor.users.update({_id: userId}, { $set: { adminPanel: false } });
    }
});