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

    //Immediately load start page from leaderboard
    var currentPage = parseInt($("#currentPageNum").attr("data-page-num"), 10);
    var lastPageNum = parseInt($("#pageCount").attr("data-page-count"), 10);
    getLeaderboardPage(currentPage);

    function getLeaderboardPage(pageNum) {
        $.ajax({
            url: "/api/leaderboard?page=" + pageNum,
            method: 'GET'
        })
        .done(function(data) {
            currentPage = parseInt(pageNum);
            if (data.leaderboardData) {
                displayLeaderboardPage(data.leaderboardData);

                //Enable/disable buttons
                if (currentPage <= 1) {
                    $("#link_firstPage").addClass("disabled");
                    $("#link_prevPage").addClass("disabled");
                } else {
                    $("#link_firstPage").removeClass("disabled");
                    $("#link_prevPage").removeClass("disabled");
                }
                if (currentPage >= lastPageNum) {
                    $("#link_nextPage").addClass("disabled");
                    $("#link_lastPage").addClass("disabled");
                } else {
                    $("#link_nextPage").removeClass("disabled");
                    $("#link_lastPage").removeClass("disabled");
                }
            }
            else
                console.log("Leaderboard loading error")
        });
    }

    function displayLeaderboardPage(data) {
        $("#loadingSpinner").removeClass("d-flex").addClass("d-none");
        $("#pageIndicator").text(currentPage + " / " + lastPageNum);
        for (var i = 0; i < data.length; i++ ) {
            var newRow = "<tr><td>" + data[i].index + "</td><td>" + data[i].name + "</td><td>" + data[i].score + "</td></tr>";
            $("#leaderboardBody").append(newRow);
            if (data[i].isCurrentUser)
                $("#leaderboardBody tr:last").addClass("table-info");
        }
    }

    function displayLeaderboardSpinner() {
        $("#loadingSpinner").removeClass("d-none").addClass("d-flex");
        $("#leaderboardBody").empty();
    }

    $("#link_firstPage").click(function(event) { 
        displayLeaderboardSpinner();
        getLeaderboardPage(0);
    });

    $("#link_lastPage").click(function(event) {
        displayLeaderboardSpinner();
        getLeaderboardPage(lastPageNum);
    });

    $("#link_nextPage").click(function(event) {
        var newPageNum = currentPage+1;
        if (newPageNum > lastPageNum)
            newPageNum = lastPageNum;
        displayLeaderboardSpinner();
        getLeaderboardPage(newPageNum);
    });

    $("#link_prevPage").click(function(event) {
        var newPageNum = currentPage-1;
        if (newPageNum < 1)
            newPageNum = 1;
        displayLeaderboardSpinner();
        getLeaderboardPage(newPageNum);
    });
});