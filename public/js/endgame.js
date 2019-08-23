$(document).ready(function() {

    var progressBar = $("#shutdownProgress");
    var textHeader = $("#shutdownText");
    var textSm = $("#shutdownSubtext");
    $("#overridePasswordCollapse").collapse('hide');
    $("#destroyedCollapse").collapse('hide');

    var animState = "discharge";
    var width = 100000;
    var counter = 0;
    var interval = 100;
    var progressBarTimer = setInterval(animate, interval);
    var countdownTimer;

    function animate() {
        if (animState == "discharge") {
            if (width <= 21000) {
                animState = "pause"
                textHeader.text("Error detected...");
            } else {
                if (width > 55000)
                    width -= 700;
                else if (40000 < width <= 55000)
                    width -= 400;   
                else if (36000 < width <= 40000)
                    width -= 100; 
                else if (width <= 36) {
                    width -= 20;
                }
                progressBar.css("width", width/1000 + "%");
                progressBar.text(Math.trunc(width/1000) + "%");
            }
        }
        else if (animState == "pause") {
            if (counter >= 4000) {
                counter = 0;
                animState = "recharge"
                textHeader.text("Error! Hacking Attempt Detected!").removeClass("text-warning").addClass("text-danger");
                textSm.text("Recharging!")
                $("#overridePasswordCollapse").collapse('show');
            } else {
                counter += interval;
            }
        }
        else if (animState == "recharge") {
            if (width >= 90000) {
                animState = "stop"
            } else {

                if (width < 30000)
                    width += 50;
                else if (30000 <= width < 35000)
                    width += 40;             
                else if (35000 <= width < 38000)
                    width += 30;               
                else if (38000 <= width < 42000)
                    width += 20;  
                else if (42000 <= width < 45000)
                    width += 10;       
                else if (45000 <= width < 52000)
                    width += 5;        
                else if (52000 <= width < 90000)
                    width += 1;
                progressBar.css("width", width/1000 + "%");
                progressBar.text(Math.trunc(width/1000) + "%");
            }
        }
    }

    $( ".form_finalPassword" ).submit(function( event ) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
        var solutionId = parseInt($(this).find('input[name="overridePassword"]').attr("data-solution-id"));
        var password = $(this).find('input[name="overridePassword"]').val();

        var uri = "/api/user/me/submitPassword";
        $.post({
            url: uri,
        }, {'solutionId': solutionId+1, 'password': password})
        .done(function(data) {
            if (data == true) {
                //Winner!
                $("#overridePasswordHelpText").removeClass("text-light").removeClass("text-danger")
                .addClass("text-success").fadeOut(150, function() {
                    $("#overridePasswordHelpText").text("Override Password Accepted! Destroying Laser...")
                    .fadeIn(150).fadeOut(150).fadeIn(150)
                    
                    countdownTimer = setInterval(countdownText, 1000);
                    counter = 7;
                    $( ".form_finalPassword" ).find('.btn').prop('disabled', "true");
                    $( ".form_finalPassword" ).find('.form-control').prop('disabled', "true");

                });
            } else {
                //Invalid Password
                $("#overridePasswordHelpText").removeClass("text-light").addClass("text-danger").fadeOut(150, function() {
                    $("#overridePasswordHelpText").text("Incorrect Password! Try Again!")
                    .fadeIn(150).fadeOut(150).fadeIn(150);
                });
            }
        });
    });

    function countdownText() {
        if (counter > 5) {
            counter--;
        }
        else if (counter > 0) {
            $("#overridePasswordHelpText").text("Self Destruct in " + counter + " seconds");
            counter--;
        } 
        else {
            clearInterval(countdownTimer);
            $("#overridePasswordHelpText").text("Self Destruct initiated!");
            //Intentionally cause lots of weird timing
            setTimeout(brokenText1, 2000);
            setTimeout(brokenText1, 2500);
            setTimeout(brokenText2, 3000);
            setTimeout(brokenText2, 3300);
            setTimeout(brokenText2, 3400);
            setTimeout(brokenText3, 4000);
            setTimeout(brokenText3, 4400);
            setTimeout(finalText, 9000);
        }
    }

    function brokenText1() {
        $("#shutdownText").text("NaN")
        setTimeout(function() {
            $("#shutdownText").text("-- error --")
            setTimeout(function() {
                $("#shutdownText").text("NaN NaN");
                setTimeout(function() {
                    $("#shutdownText").text("NaN NaN NaN NaN");
                    setTimeout(function() {
                        $("#shutdownText").text("NaN NaN NaN NaN NaN NaN NaN NaN");
                    }, 800);
                }, 800);
            }, 500);
        }, 1200);
    }

    function brokenText2() {
        $("#shutdownSubtext").text("-- error --")
        setTimeout(function() {
            $("#shutdownSubtext").text("-- error --")
            setTimeout(function() {
                $("#shutdownSubtext").text("NaN NaN");
                setTimeout(function() {
                    $("#shutdownSubtext").text("NaN NaN NaN NaN");
                    setTimeout(function() {
                        $("#shutdownSubtext").text("-- offline --");
                    }, 800);
                }, 800);
            }, 500);
        }, 1200);
    }

    function brokenText3() {
        clearInterval(progressBarTimer);
        $("#shutdownProgress").text("-- error --")
        $("#shutdownProgress").css("width", "80%");
        setTimeout(function() {
            $("#shutdownProgress").text("-- error --")
            $("#shutdownProgress").css("width", "60%");
            setTimeout(function() {
                $("#shutdownProgress").text("NaN NaN");
                $("#shutdownProgress").css("width", "45%");
                setTimeout(function() {
                    $("#shutdownProgress").text("NaN NaN NaN NaN");
                    $("#shutdownProgress").css("width", "30%");
                    setTimeout(function() {
                        $("#shutdownProgress").text("NaN NaN NaN NaN NaN NaN NaN NaN");
                        $("#shutdownProgress").css("width", "20%");
                    }, 800);
                }, 800);
            }, 500);
        }, 1200);
    }

    function finalText() {
        $("#destroyedCollapse").collapse('show');
        $("#overridePasswordHelpText").text("Self Destruct complete!");
    }

});