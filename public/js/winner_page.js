$(document).ready(function() {

    var timeoutId = 0;

    //Override the push and hold action because it isn't working on all phones.
    $( "#prizeImage" ).click(function(event) {
        showClaimUi();
    });

    $('#prizeImage').on('mousedown', function() {
        timeoutId = setTimeout(showClaimUi, 100);
    }).on('mouseup mouseleave', function() {
        clearTimeout(timeoutId);
    });

    function showClaimUi() {
        $('#claimPrizeCollapse').collapse('show')
    }

    $( "#btnClaimPrize" ).click(function(event) {
        $.ajax({
            url: "/api/user/me/claimPrize",
            method: 'POST'
        }).done(function(data) {
            location.reload();
        });
    });
});