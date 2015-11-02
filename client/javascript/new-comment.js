Template.newcomment.rendered = function() {
    Meteor.call("buildSummernoteForm");
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