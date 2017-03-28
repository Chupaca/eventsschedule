var textEditor_modal = new $.UIkit.modal("#textEditor_modal", { modal: false, keyboard: false, bgclose: false  });
var modulForAddNewCategoryEvent = new $.UIkit.modal("#modulForAddNewCategoryEvent", { modal: false, keyboard: false, bgclose: true  });

$(document).ready(function () {
    $(document).on("click", function (e) {
        if ($(e.target).parents(".category_nav").length <= 0) {
            $(".protocols, .subcategory").slideUp();
            $(".category").find("a").css({ "background": "" });
            $(".category").removeClass("uk-active");
        }
    })
})

$("#addNewCategoryBtn").click(function(){
    $("#name_new_category_input").val("");
    modulForAddNewCategoryEvent.show();
})

$("#addNewCategoryEvent").click(function(){
    var category = $("#name_new_category_input").val().trim();
    if(category.length>0){
        $.ajax({
            url: "/category/add",
            type:"POST",
            data:{"Category":category},
            success:function(data){
                if(data){
                    Flash("בוצע בהצלכה!");
                        modulForAddNewCategoryEvent.hide();           
                }else{
                   Flash("התרחשה שגיאה", "error");
                }
            },
            error:function(err){
                Flash("התרחשה שגיאה", "error");
                console.log(err);
            }
        })
    }else{
        Flash("שדה קטגוריה ריק!", "warning");
    }
})


// $(".protocols>li").click(function (e) {
//     e.preventDefault();
//     e.stopPropagation();

//     var category = $(this).closest(".category").find('a').first().text();
//     var categoryid = $(this).closest(".category").find('a').first().data("id-category")
//     var subcategory = $(this).parent(".protocols").prev().text();
//     var subcategoryid = $(this).parent(".protocols").prev().data("id-subcategory");
//     var protocol = $(this).find("a").text();
//     var protocolid = $(this).find("a").data("id-protocol");

//     $("#path_page").html(`&nbsp;<i class="uk-icon-caret-square-o-left"></i>&nbsp;
//                             <span id="category_title" data-id="${categoryid}">${category}</span>
//                             &nbsp;<i class="uk-icon-long-arrow-left"></i>&nbsp;
//                             <span id="subcategory_title" data-id="${subcategoryid}">${subcategory}</span>
//                            &nbsp; <i class="uk-icon-long-arrow-left"></i>&nbsp;
//                             <span id="protocol_title" data-id="${protocolid}">${protocol}</span>
//                             &nbsp;<i class="uk-icon-long-arrow-left"></i>&nbsp;
//                             <span id="vertion_active" data-id=""></span>
//                             `);
//     $(".protocols, .subcategory").slideUp();
//     $(".category").find("a").css({ "background": "" });
//     $(".category").removeClass("uk-active");
//     $.get("/protocols/getprotocol/" + protocolid, function (results) {
//         buildSelectVertions(results[1], results[0]);
//         if (results[0].AddedImages && JSON.parse(results[0].AddedImages)) {
//             $("#showSavedImages").attr("data-id", protocolid);
//             $("#showSavedImages").css({ "display": "" });
//         }
//         $("#vertion_active").text(results[0].Vertion.toFixed(1));
//         $("#contener_page").html(results[0].Html).css({ "border": "2px double #ccc" });
//         window.history.pushState('page2', 'Title', '/protocols/protocolsdisplay/' + protocolid);
//     })
//     $("#edit_protocol, #remove_protocol").css({ "display": "" });
// })



$("#edit_protocol").click(function () {
    $('.panel-body').empty();
    $("#title_protocol_modal").val($("#protocol_title").text());
    $("#category_select").find("[value='" + $("#category_title").data("id") + "']").prop("selected", true);
    $("#subcategory_select").find("[value='" + $("#subcategory_title").data("id") + "']").prop("selected", true);
    $("#saveNew").attr('data-event', 'edit');
    $("#texteditor_protocolid").val($("#protocol_title").data("id"));
    $('#contener_page').contents().clone().appendTo($('.panel-body'));
    clearTextFromNewClass($('.panel-body'));
    textEditor_modal.show();

});

$("#addNewEvent").click(function () {
    $("#newSubCategory, #title_protocol_modal").val("");
    $(".newHidden").hide();
    $("#subcategory_select option, #category_select option").first().prop("selected", true);
    $('.panel-body').empty();
    $("#subcategory_select").prop("disabled", true);
    $("#saveNew").attr('data-event', 'save');
    $("#texteditor_protocolid").val("");
    textEditor_modal.show();
})

$('#textEditor_modal').on({
    'show.uk.modal': function () {
    },
    'hide.uk.modal': function () {
    }
});


$("#searchEventesBtn").click(function () {
    var forSearch = {};
    $(".protocolsearch").each(function (i, item) {
        if ($(item).val().trim().length > 0) {
            forSearch[$(item).attr("id")] = $(item).val().trim();
        }
    })
    if (!jQuery.isEmptyObject(forSearch)) {
        $.ajax({
            url: "/protocols/search",
            type: "POST",
            data: forSearch,
            success: function (result) {
                if (result.length > 0) {
                    buildAfterSearch(result);
                    Flash(" :על פי חיפוש נמצע " + result.length);
                } else {
                    Flash("אין תוצאות על פי חיפוש", "warning");
                }
            },
            error: function (data) {
                Flash("התרחשה שגיאה", "error");
            },
        });
    } else {
        Flash("אין פרתי חיפוש!", "warning");
    }
})

function buildAfterSearch(arrayProtocols) {
    var text = "<h2>נוהלים על פי חיפוש: </h2><ol class='protocol_list'>";
    for (var inx = 0; inx < arrayProtocols.length; inx++) {
        text += `<li><a href="/protocols/protocolsdisplay/${arrayProtocols[inx]._id}">${arrayProtocols[inx].Title}</a></li><hr> `
    }
    text += "</ol>";
    $("#contener_page").css({ "border": "0" });
    $("#path_page, #forVertions").empty();
    $("#contener_page").html(text);
};

$("#cleanfilter").click(function () {
    $(".search_block").val("");
    $(".search_block_category option:eq(0)").prop("selected", true);
})

$("#remove_protocol").click(function () {
    var id = $("#protocol_title").data("id");
    $.get("/protocols/remove/" + id, function (result) {
            Flash("removed");
           window.location.assign("/protocols/protocolsdisplay");
    })
})

function Flash(message, type) {
    if (!type)
        type = "success";
    var noty = jQuery.notyRenderer.init({ text: message, type: type, layout: 'topCenter', timeout: 2000 });
};
