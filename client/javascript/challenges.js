Template.challenges.helpers({
    latestChallenge: function () {
        var latestChallengeDocument = Challenges.findOne({}, {sort: {createdAt: -1}});
        if (latestChallengeDocument) {
            return latestChallengeDocument;
        }
    }
});