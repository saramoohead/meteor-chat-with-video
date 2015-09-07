Template.video.helpers({
    latestVideo: function () {
        var latestVideoDocument = Videos.findOne({}, {sort: {createdAt: -1}});
        if (latestVideoDocument) {
            return latestVideoDocument.videoLink;
        }
    }
});