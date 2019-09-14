$(document).ready(function() {
    console.log("Database Management JS Loaded");

    $( "#resyncWarning" ).click(function(event) {
        $("#resyncButtons").removeClass("invisible").addClass("visible");
    });

    $( "#btnResyncStrings" ).click(function(event) {
        $.ajax({
            url: "/api/db/syncStrings",
            method: 'DELETE'
        }).done(function(data) {
           console.log("Strings Resynced Successfully");
        });
    });

    $( "#btnResyncUsers" ).click(function(event) {
        $.ajax({
            url: "/api/db/syncUsers",
            method: 'DELETE'
        }).done(function(data) {
           console.log("Users Resynced Successfully");
        });
    });

    $( "#btnResyncBlogPosts" ).click(function(event) {
        $.ajax({
            url: "/api/db/syncBlogPosts",
            method: 'DELETE'
        }).done(function(data) {
           console.log("Blog Posts Resynced Successfully");
        });
    });

    $( "#btnResyncPuzzles" ).click(function(event) {
        $.ajax({
            url: "/api/db/syncPuzzles",
            method: 'DELETE'
        }).done(function(data) {
           console.log("Puzzles Resynced Successfully");
        });
    });

    $( "#btnCalcPrizes" ).click(function(event) {
        $.ajax({
            url: "/api/db/recalculatePrizes",
            method: 'POST'
        }).done(function(data) {
           console.log("Prizes Calculated Successfully");
        });
    });

});