$(document).ready(function() {

    //Bootstrap-ize some elements in the blog posts
    $(".card-body img").addClass("rounded mx-auto img-fluid");
    $(".card-body iframe").addClass("embed-responsive-item").wrap("<div class=\"embed-responsive embed-responsive-16by9\"></div>");

    $( ".form_submitPassword" ).submit(function( event ) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
        var thisForm = $(this);
        var solutionId = parseInt($(this).find('input[name*="securityQuestion"]').attr("data-solution-id"));
        var password = $(this).find('input[name*="securityQuestion"]').val();

        var uri = "/api/user/me/submitPassword";
        console.log(uri);
        $.post({
            url: uri,
        }, {'solutionId': solutionId+1, 'password': password})
        .done(function(data) {
            console.log(data)
            if (data == true) {
                //Update Glyph
                thisForm.parents(".row").find('.checkmark-glyph')
                .removeClass("fa-times-circle").removeClass("error")
                .removeClass("fa-circle").removeClass("neutral")
                .addClass("fa-check-circle").addClass("success");
                thisForm.parents(".card").removeClass("border-light").addClass("border-success");
                thisForm.parents(".card").find('.btn-primary')
                .removeClass("btn-primary").addClass("btn-secondary");
        
                //Disable inputs
                thisForm.find('button[type="submit"]').prop('disabled', "true");
                thisForm.find('input[name*="securityQuestion"]').prop('disabled', "true")
                    .val("").prop('placeholder', "Unlocked!");
            } else {
                //Update Glyph)
                thisForm.parents(".row").find('.checkmark-glyph')
                .removeClass("fa-check-circle").removeClass("success")
                .removeClass("fa-circle").removeClass("neutral")
                .addClass("fa-times-circle").addClass("error");
                thisForm.parents(".card").removeClass("border-light").addClass("border-danger");
            }
            // $( "#command-output" ).text(JSON.stringify(data));
        });
        
    });

});