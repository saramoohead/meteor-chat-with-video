Template.newcomment.rendered = function() {
    var template = this;
    $('#summernote').summernote({
        height: 150,
        maxHeight:100,
        minHeight:200,
        dialogsInBody: true,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough']],
            ['color', ['color']],
            ['height', ['height']],
            ['insert', ['link']]
        ],
        onCreateLink: function (url) {
            if (url.indexOf('http://') !== 0) {
                url = 'http://' + url;
            }
            return url;
        }
    });
};

Template.newcomment.events({
    "submit .new-comment": function (event) {
        event.preventDefault();

        var commentText = $('#summernote').code().trim();
        var currentChallenge = this._id;
        if(commentText !== "") {
            Meteor.call("addComment", commentText, currentChallenge);
        }
        $('#summernote').code('');
    }
});

Template.newcomment.onDestroyed(function() {
    $('#summernote').destroy();
});