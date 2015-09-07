Template.video.helpers({
    latestVideo: function () {
        var latestVideoDocument = Videos.findOne({}, {sort: {createdAt: -1}});
        if (latestVideoDocument) {
            return latestVideoDocument.videoLink;
        } else {
          return '<iframe width="560" height="315" src="https://www.youtube.com/embed/isY9xGGvf1o" frameborder="0" allowfullscreen></iframe>';
        }
    }
});