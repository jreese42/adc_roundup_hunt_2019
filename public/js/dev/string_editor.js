$(document).ready(function() {
    console.log("String Editor JS Loaded");

    var clearEditor = function() {
        $("#stringReferenceName").val("");
        $("#stringValue").val("");
    }
    
    $('#stringEditor_selectString').find('option[value=""]').attr('selected', 'selected');
    clearEditor();
    
    $('#stringEditor_selectString').on('change', function() {
        //clear out the editor
        if ($("#stringEditor_selectString").val() == "new") {
            clearEditor();
        } else {
            
            var referenceName = $("#stringEditor_selectString").val();  
            $.get({
                url: "/api/string/" + referenceName,
            })
            .done(function(stringData) {
                if (stringData) {
                    if(stringData.referenceName) $("#stringReferenceName").val(stringData.referenceName);
                    else $("#stringReferenceName").val("");
                    if(stringData.value) $("#stringValue").val(stringData.value); 
                    else $("#stringValue").val("");
                }
            });
        }
    });

    $( "#stringEditor_btnDelete" ).click(function(event) {
        event.preventDefault();
        var referenceName = $("#stringEditor_selectString").val();

        $.post({
            url: "/api/string/" + referenceName + "/delete",
        })
        .done(function(data) {
            console.log(data);
            if (data == true) {
                $( '#stringEditor_selectString' ).find("option[value='" + referenceName + "']").remove();
                clearEditor();
            }
        });
    });

    $( "#stringEditor_btnSave" ).click(function(event) {
        event.preventDefault();   

        var referenceName = $("#stringEditor_selectString").val();

        if ($("#stringEditor_selectString").val() == "new") {
            var post_params = {
                referenceName: $("#stringReferenceName").val(),
                value: $("#stringValue").val()
            }
            $.post({
                url: "/api/string/createNew",
            }, post_params)
            .done(function(newString) {
                $( '#stringEditor_selectString' ).append(new Option($("#stringReferenceName").val(), $("#stringReferenceName").val(), true, true));
            });
        } else {
            var referenceName = $("#stringEditor_selectString").val();
            var post_params = {
                value: $("#stringValue").val()
            }
            $.post({
                url: "/api/string/" + referenceName,
            }, post_params)
            .done(function(result) {
                if (result == true)
                    console.log("Saved!")
                else
                    console.log("Error while saving")
            });
        }
    });

});