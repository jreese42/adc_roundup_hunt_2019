$(document).ready(function() {

    $( ".nameOptionSelector" ).click(function( event ) {
        var displayNameFormat = $(this).attr("data-name-option");

        var uri = "/api/user/me/displayNameFormat";
        $.post({
            url: uri,
        }, {'displayNameFormat': displayNameFormat})
        .done(function(data) {
            location.reload();
        });
    });
});