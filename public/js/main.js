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
        $.post({
            url: uri,
        }, {'solutionId': solutionId+1, 'password': password})
        .done(function(data) {
            if (data == true) {
                //Update Glyph
                thisForm.parents(".row").find('.checkmark-glyph')
                .removeClass("fa-times-circle").removeClass("error")
                .removeClass("fa-circle").removeClass("neutral")
                .addClass("fa-check-circle").addClass("success");
                thisForm.parents(".card").removeClass("border-light").removeClass("border-danger").addClass("border-success");
                thisForm.parents(".card").find('.btn-primary')
                .removeClass("btn-primary").addClass("btn-secondary");
        
                //Disable inputs
                thisForm.find('button[type="submit"]').prop('disabled', "true");
                thisForm.find('input[name*="securityQuestion"]').prop('disabled', "true")
                    .val("").prop('placeholder', "Unlocked!");

                //Check Winner
                if ($('input:disabled[name*="securityQuestion"]').length >= 5) {
                    location.reload();
                }
            } else {
                //Update Glyph)
                thisForm.parents(".row").find('.checkmark-glyph')
                .removeClass("fa-check-circle").removeClass("success")
                .removeClass("fa-circle").removeClass("neutral")
                .addClass("fa-times-circle").addClass("error");
                thisForm.parents(".card").removeClass("border-light").addClass("border-danger");
            }
        });
        
    });

    //About Page
    var countdownSeconds;
    var countdownTimer;
    if ($("#gameCountdownClock")){
        var dateStart = new Date($("#gameCountdownClock").attr("data-start-time"));
        var dateNow = new Date(Date.now());
        if (!isNaN(dateStart)) {
            if (dateNow < dateStart) {
                var countdownSeconds = Math.floor(dateStart - dateNow) / 1000;
                countdownTimer = setInterval(tickCountdownClock1s, 1000);

            } else {
                //already started
                $("#gameCountdownClock").text("");
            }
        }
    }

    function tickCountdownClock1s() {
        countdownSeconds -= 1;
        if (countdownSeconds < 1) {
            $("#gameCountdownText").text("The game is live!");
            $("#gameCountdownClock").html('<a href="/" class="btn btn-dark btn-lg">Go to the Game!</a>');
            clearInterval(countdownTimer);
            return;
        }

        hours = Math.floor(countdownSeconds / 3600);
        minutes = Math.floor(countdownSeconds / 60) % 60;
        seconds = Math.floor(countdownSeconds) % 60;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        
        if (hours >= 16) {
            days = parseInt(Math.ceil(hours / 24));
            plural = (days == 1) ? "" : "s";
            $("#gameCountdownClock").text(days + " day" + plural);
        }
        else{
            $("#gameCountdownClock").text(hours + ":" + minutes + ":" + seconds);
        }
    }


});