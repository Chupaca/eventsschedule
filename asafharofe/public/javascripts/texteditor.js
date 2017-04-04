
$(document).ready(function () {

    $('#summernote').summernote({
        height: 400,
        lang: 'he-IL',
        disableDragAndDrop: false,
        toolbar: [
            ['style', ['bold', 'italic', 'underline']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['hr', ['hr']],
            ['table', ['table']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['style', ['clear']],
            ['undo', ['undo']],
            ['redo', ['redo']]
        ]
    });
})



$("#saveNew").click(function (e) {
    e.preventDefault();
    if ($("#saveNew").data('event') == 'edit') {
        editProtocol();
    } else {
        var makrup = $('#summernote').summernote('code');
        var newEvent = buildNewEvent(makrup);
        if (newEvent) {
            $.ajax({
                url: "/events/createnewevent",
                type: 'post',
                data: newEvent,
                success: function (result) {
                    if (result) {
                        Flash(" אירוע חדש הוקלד בהצלחה! ");
                        $("#category_select option").first().prop("selected", true);
                        $('.panel-body').empty();
                        textEditor_modal.hide();
                        window.location.href = "/displayevents";
                    } else {
                        Flash("", "error");
                    }
                }
            })
        }
    }
})

function editProtocol() {
    var makrup = $('#summernote').summernote('code');
    var newEvent = buildNewEvent(makrup);
    if (newEvent) {
        $.ajax({
            url: "/events/edit/" + $("#texteditor_eventid").val(),
            type: 'post',
            data: newEvent,
            success: function (result) {
                if (result) {
                    $("#category_select option").first().prop("selected", true);
                    $('.panel-body').empty();
                    Flash(" אירוע הוקלד בהצלחה! ");
                    textEditor_modal.hide();
                    window.location.href = "/displayevents";
                } else {
                    Flash("", "error");
                }
            }
        })
    }
}

function buildNewEvent(text) {
    var newEvent = {};
    var title;
    var html;
    if ($("#category_select option:selected").val() != 0) {
        var category = $("#category_select option:selected").val();
        var categoryName = $("#category_select option:selected").text();
    } else {
        Flash("צריך לפחור קטגוריה", "error");
        return null;
    }

    if ($("#title_event_modal").val().trim().length > 0) {
        title = $("#title_event_modal").val().trim();
    } else {
        Flash(" צריך למלות שדה כותרת! ", "error");
        return null;
    }
    if (text.trim() != "<p><br></p>") {
        html = text.trim();
    } else {
        Flash(" נוהל ריק! ", "error");
        return null;
    }
    newEvent.CategoryId = category;
    newEvent.CategoryName = categoryName;
    newEvent.Text = text;
    newEvent.Title = title;
    return newEvent;
}