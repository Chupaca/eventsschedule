
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
        var protocol = buildProtocol(makrup);
        if (protocol) {
            $(".textEditor_contaner").css({
                filter: "blur(3px)"
            })
            $(".loading_img").addClass("loader");
            $.ajax({
                url: "/protocols/createnewprotocol",
                type: 'post',
                data: protocol,
                success: function (result) {
                    if (result) {
                        var senderName = $(".uk-navbar-nav-subtitle").find("b").text().trim();
                        uploadfiles(result._id, senderName, "Protocols", function () {
                            $(".loading_img").removeClass("loader");
                            $(".textEditor_contaner").css({
                                filter: "blur(0)"
                            })
                            Flash(" נוהל חדש הוקלד בהצלחה! ");
                            $("#newSubCategory, #title_protocol_modal").val("");
                            $(".newHidden").hide();
                            $("#subcategory_select option, #category_select option").first().prop("selected", true);
                            $('.panel-body').empty();
                            textEditor_modal.hide();
                            window.location.href = "/protocols/protocolsdisplay";
                        })
                    } else {
                        Flash("", "error");
                    }
                }
            })
        } else {
            Flash("", "error");
            return;
        }
    }
})

function editProtocol() {
    var makrup = $('#summernote').summernote('code');
    var protocol = buildProtocol(makrup);
    if (protocol) {
        $(".textEditor_contaner").css({
            filter: "blur(3px)"
        })
        $(".loading_img").addClass("loader");
        $.ajax({
            url: "/protocols/editprotocol/" + $("#texteditor_protocolid").val(),
            type: 'post',
            data: protocol,
            success: function (result) {
                if (result) {
                    var senderName = $(".uk-navbar-nav-subtitle").find("b").text().trim();
                    uploadfiles($("#texteditor_protocolid").val(), senderName, "Protocols", function () {
                        $(".loading_img").removeClass("loader");
                        $(".textEditor_contaner").css({
                            filter: "blur(0)"
                        })
                        Flash(" נוהל חדש הוקלד בהצלחה! ");
                        textEditor_modal.hide();
                        location.reload(true);
                    })
                } else {
                    Flash("", "error");
                }
            }
        })
    } else {
        Flash("", "error");
        return;
    }
}

$("#category_select").change(function () {
    if ($("#category_select option:selected").val() == '0') {
        $("#subcategory_select").prop("disabled", true);
    } else {
        $("#subcategory_select option").first().prop("selected", true);
        $("#subcategory_select option").css({ "display": "none" });
        var selectedClass = $("#category_select option:selected").val();
        $("." + selectedClass).css({ "display": "" });
        $("#subcategory_select option").last().css({ "display": "" });
        $(".newHidden").hide();
        $("#subcategory_select").prop("disabled", false);
    }
})
$("#subcategory_select").change(function () {
    if ($("#subcategory_select option:selected").val() == "1111") {
        $(".newHidden").show();
    } else {
        $(".newHidden").hide();
    }
})


function buildProtocol(text) {
    var protocol = {};
    var newSubCategory = false;
    var title;
    var html;
    if ($("#category_select option:selected").val() != 0) {
        var category = $("#category_select option:selected").val();
        var categoryName = $("#category_select option:selected").text();
    } else {
        Flash("צריך לפחור קטגוריה", "error");
        return null;
    }
    if ($("#subcategory_select option:selected").val() == "1111") {
        if ($("#newSubCategory").val().trim().length > 0) {
            var subcategory = $("#newSubCategory").val().trim();
            newSubCategory = true;
        } else {
            Flash("צריך לפחור תת קטגוריה", "error");
            return null;
        }
    } else if ($("#subcategory_select option:selected").val() != 0) {
        var subcategory = $("#subcategory_select option:selected").val();
    } else {
        Flash("צריך לפחור תת קטגוריה", "error");
        return null;
    }
    if ($("#title_protocol_modal").val().trim().length > 0) {
        title = $("#title_protocol_modal").val().trim();
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
    protocol.Category = category;
    protocol.CategoryName = categoryName;
    protocol.SubCategory = subcategory;
    protocol.Text = text;
    protocol.Title = title;
    protocol.newSubCategory = newSubCategory;
    protocol.AddedImages = (fileCollection.length > 0 || $("#showSavedImages").css("display") != "none") ? true : false;
    protocol.TmpFilesIds = tmpFilesIds;
    return protocol;
}

// $(".upload_files").click(function () {
//     var autosend = $(this).data("autosend");
//     var modulename = $(this).data("modulename");
//     var type = $(this).data("type");
//     $(".uploded_contaner").css({ "display": "" })
//     openUploadBoxForTasks(autosend, modulename, type, "textEditor_modal");
// })

// function Flash(message, type) {
//     if (!type)
//         type = "success";

//     var noty = jQuery.notyRenderer.init({ text: message, type: type, layout: 'topCenter', timeout: 2000 });
// }

// window.onload = function () {
//     $(".uploadFileField .image-upload-drop").css({
//         "font-size": "2vh"
//     })
//     $(".upload-drop").css({ "height": "200px" });
//     $(".uploded_contaner").css({ "display": "none" })
// }

// function uuid() {
// 	var text = "";
// 	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// 	for (var i = 0; i < 6; i++) {
// 		text += possible.charAt(Math.floor(Math.random() * possible.length));
// 	}
// 	return text;
// }