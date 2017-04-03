var textEditor_modal = new $.UIkit.modal("#textEditor_modal", { modal: false, keyboard: false, bgclose: false  });
var modulForAddNewCategoryEvent = new $.UIkit.modal("#modulForAddNewCategoryEvent", { modal: false, keyboard: false, bgclose: true  });
var history_modal = new $.UIkit.modal("#history_modal", { modal: false, keyboard: false, bgclose: true  });
var view_event_page = new $.UIkit.modal("#view_event_page", { modal: false, keyboard: false, bgclose: true  });

$(document).ready(function () {
    $(document).on("click", function (e) {
    })
})

$("#addNewEvent").click(function () {
    $("#newSubCategory, #title_protocol_modal").val("");
    $(".newHidden").hide();
    $("#subcategory_select option, #category_select option").first().prop("selected", true);
    $('.panel-body').empty();
    $("#subcategory_select").prop("disabled", true);
    $("#saveNew").attr('data-event', 'save');
    $("#texteditor_eventid").val("");
    textEditor_modal.show();
})

$(".edit_event").click(function () {
    $('.panel-body').empty();
    var categoryid = $(this).closest(".eventsContainer").prev().find(".list_row_event").find("[name='list_events_category_name']").data("categoryid");
    var title = $(this).closest(".eventsContainer").prev().find(".list_row_event").find("[name='list_events_title']").text().trim();
    $("#category_select").find("[value='" + categoryid + "']").prop("selected", true);
    $("#saveNew").attr('data-event', 'edit');
    $("#title_event_modal").val(title);
    $(this).closest(".eventsContainer").find(".text_box_event").contents().clone().appendTo($('.panel-body'));
     $("#texteditor_eventid").val($(this).closest(".eventsContainer").data("eventid"));
    textEditor_modal.show();

});

$(".show_changes").click(function(){
    var eventid = $(this).closest(".eventsContainer").data("eventid");
    $.get('/events/getnotes/' + eventid, function(notes){
        if(notes && notes[0].Notes &&  notes[0].Notes.length> 0){
            var text = `<table class="uk-table uk-table-striped">`;
            for(var inx=0;inx<notes[0].Notes.length;inx++){
                var note = notes[0].Notes[inx];
                text += `<tr><td>${inx+1}.</td><td>${note.EditorName.toString()}</td><td>${moment(note.Date).format("DD/MM/YYYY HH:mm")}</td></tr>`
            }
            text +=`</table>`
            $(".list_event_edits").html(text);
            history_modal.show();
        }else{
            Flash("אין היסטוריה עריכות ", "warning");
        }
    })
});

$(".show_event").click(function(){
    var categoryname = $(this).closest(".eventsContainer").prev().find(".list_row_event").find("[name='list_events_category_name']").text().trim();
    var title = $(this).closest(".eventsContainer").prev().find(".list_row_event").find("[name='list_events_title']").text().trim();
    $("#view_category_name").html(categoryname);
    $("#view_title u").html(title);
    $(this).closest(".eventsContainer").find(".text_box_event").contents().clone().appendTo($('#view_contener'));
    view_event_page.show();
});

$('#print_Event').click(function(){
  var head = $("#view_event_page").find(".uk-modal-header").html();
  var contener = $("#view_contener").html();
  var newWin = window.open('', 'Print-Window', 'width=700,height=800');
    newWin.document.writeln(`<!DOCTYPE html lang="he"><head><title>Print</title>
        <meta charset="utf-8" />
    <link rel="stylesheet" href="/stylesheets/uikit-orders.css">
    </head><body dir="rtl">`);
  newWin.document.write(head + "<br>" + title.innerHTML + "<br><div style='margin:25px;border:2px solid;padding:15px 30px;'>" 
  + contener +'</div><script> window.onload = window.print(); </script></body></html>');
  // setTimeout(function(){newWin.close();},10);
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

//========================= for manager ================
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

//================= end ==============================
$('#textEditor_modal').on({
    'show.uk.modal': function () {
    },
    'hide.uk.modal': function () {
    }
});

function Flash(message, type) {
    if (!type)
        type = "success";
    var noty = jQuery.notyRenderer.init({ text: message, type: type, layout: 'topCenter', timeout: 2000 });
};
