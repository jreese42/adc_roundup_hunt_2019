$(document).ready(function() {
    console.log("Dev JS Loaded");
    
    $( "#form_findUser" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        if(attendeeId) {
            var uri = "/api/user/" + attendeeId;
            console.log(uri);
            $.ajax({
                url: uri,
                method: 'GET'
            }).done(function(data) {
               console.log(data);
               $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });

    $( "#form_createUser" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        var firstName = $(this).find('input[name="firstName"]').val();
        var lastName = $(this).find('input[name="lastName"]').val();
        if(attendeeId) {
            var createUser_uri = "/api/user/" + attendeeId + "/create?firstName=" + firstName + "&lastName=" + lastName;
            console.log(createUser_uri);
            $.ajax({
                url: createUser_uri,
                method: 'POST'
            }).done(function(data) {
               console.log(data);
               $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });
    $( "#form_deleteUser" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        if(attendeeId) {
            var deleteUser_uri = "/api/user/" + attendeeId + "/delete";
            console.log(deleteUser_uri);
            $.ajax({
                url: deleteUser_uri,
                method: 'POST'
            }).done(function(data) {
                console.log(data);
                $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });
    
    $( "#form_setUserName" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        var newName = $(this).find('input[name="customName"]').val();

        if(attendeeId) {
            var uri = "/api/user/" + attendeeId + "/name";
            console.log(uri);
            $.post({
                url: uri
            }, {'name': newName})
            .done(function(data) {
                console.log(data);
                $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });

    $( "#form_setDisplayFormat" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        var displayNameFormat = $(this).find('select[name="displayNameFormat"]').val();
        console.log(displayNameFormat);

        if(attendeeId) {
            var uri = "/api/user/" + attendeeId + "/displayNameFormat";
            console.log(uri);
            $.post({
                url: uri,
            }, {'displayNameFormat': displayNameFormat})
            .done(function(data) {
                console.log(data);
                $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });

    $( "#form_setDisplayFormat" ).submit(function( event ) {
        event.preventDefault();
        var attendeeId = $(this).find('input[name="attendeeId"]').val();
        var displayNameFormat = $(this).find('select[name="displayNameFormat"]').val();
        console.log(displayNameFormat);

        if(attendeeId) {
            var uri = "/api/user/" + attendeeId + "/displayNameFormat";
            console.log(uri);
            $.post({
                url: uri,
            }, {'displayNameFormat': displayNameFormat})
            .done(function(data) {
                console.log(data);
                $( "#command-output" ).text(JSON.stringify(data));
            });
        }
    });

    $('#blogEditor_selectBlog').on('change', function() {
        //New post - clear out the editor
        if ($("#blogEditor_selectBlog").val() == "new") {
            console.log("Clearing editor");
            $("#blogTitle").val("");
            $("#blogSubtitle").val("");
            $("#blogAuthor").val("");
            $("#blogDate").val("");
            $("#blogTime").val("");
            $("#blogImagePath").val("");
            $("#blogReleaseDate").val("");
            $("#blogReleaseTime").val("");
            $("#blogText").val("");
        }
    });

    $( "#editor_btnDelete" ).click(function(event) {
        event.preventDefault();
        var blogId = $("#blogEditor_selectBlog").val();

        $.post({
            url: "/api/blog/" + blogId + "/delete",
        })
        .done(function(data) {
            console.log(data);
            $( '#blogEditor_selectBlog' ).find("option[value='" + blogId + "']").remove();
        });
    });

    $( "#editor_btnSave" ).click(function(event) {
        event.preventDefault();     
        //new post - create   
        if ($("#blogEditor_selectBlog").val() == "new") {
            console.log("Creating new post");
            post_params = {
                title: $("#blogTitle").val(),
                subtitle: $("#blogSubtitle").val(),
                author: $("#blogAuthor").val(),
                dateStr: $("#blogDate").val(),
                timeStr: $("#blogTime").val(),
                imagePath: $("#blogImagePath").val(),
                releaseTime: $("#blogReleaseDate").val() + " " + $("#blogReleaseTime").val(),
                text: $("#blogText").val()
            }
            $.post({
                url: "/api/blog/createNew",
            }, post_params)
            .done(function(newPost) {
                console.log(newPost);
                $( '#blogEditor_selectBlog' ).append(new Option(newPost.title, newPost.blogId, true, true));
            });
            
        }
        
    });

});