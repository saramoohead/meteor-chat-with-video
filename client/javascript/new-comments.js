Template.newcomments.rendered = function() {
    var template = this;
    $('#summernote').summernote({
        height: 150,
        maxHeight:100,
        minHeight:200,
        toolbar: [
        //[groupname, [button list]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough']],
            ['color', ['color']],
            ['height', ['height']],
            ['insert', ['link', 'picture']]
        ]
    });
};

Template.newcomments.events({
    "submit .new-comment": function (event) {
        event.preventDefault();

        var commentText = $('#summernote').code();
        var currentChallenge = this._id;
        if(commentText) {
            Meteor.call("addComment", commentText, currentChallenge);
        }
    }
});