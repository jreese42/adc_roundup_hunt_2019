$(document).ready(function() {
    console.log("Blog Editor JS Loaded");

    var clearEditor = function() {
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
    
    $('#blogEditor_selectBlog').find('option[value=""]').attr('selected', 'selected');
    clearEditor();

    var formatLocalDate = function(date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }

    var formatLocalTime = function(date) {
        var hours = '' + date.getHours();
        var minutes = '' + date.getMinutes();
    
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
    
        return [hours, minutes].join(':');
    }
    
    $('#blogEditor_selectBlog').on('change', function() {
        //New post - clear out the editor
        if ($("#blogEditor_selectBlog").val() == "new") {
            clearEditor();
        } else {
            
            var blogId = $("#blogEditor_selectBlog").val();  
            $.get({
                url: "/api/blog/" + blogId,
            })
            .done(function(blogData) {
                if (blogData) {
                    if(blogData.title) $("#blogTitle").val(blogData.title);
                    if(blogData.subtitle) $("#blogSubtitle").val(blogData.subtitle);
                    if(blogData.author) $("#blogAuthor").val(blogData.author);
                    if(blogData.date) $("#blogDate").val(blogData.date);
                    if(blogData.time) $("#blogTime").val(blogData.time);
                    if(blogData.imagePath) $("#blogImagePath").val(blogData.imagePath);
                    if(blogData.releaseTime) {
                        var releaseDate = new Date(blogData.releaseTime);
                        $("#blogReleaseDate").val(formatLocalDate(releaseDate));
                        $("#blogReleaseTime").val(formatLocalTime(releaseDate));
                    }
                    if(blogData.text) $("#blogText").val(blogData.text.replace(/<br\s*[\/]?>/gi, "\n"));
                }
            });
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
            if (data == true) {
                $( '#blogEditor_selectBlog' ).find("option[value='" + blogId + "']").remove();
                clearEditor();
            }
        });
    });

    $( "#editor_btnSave" ).click(function(event) {
        event.preventDefault();   

        var releaseDate = new Date($("#blogReleaseDate").val() + "T" + $("#blogReleaseTime").val());
        var post_params = {
            title: $("#blogTitle").val(),
            subtitle: $("#blogSubtitle").val(),
            author: $("#blogAuthor").val(),
            dateStr: $("#blogDate").val(),
            timeStr: $("#blogTime").val(),
            imagePath: $("#blogImagePath").val(),
            releaseTime: releaseDate.toISOString(),
            text: $("#blogText").val().replace(/\n/g, "<br />")
        }

        if ($("#blogEditor_selectBlog").val() == "new") {
            $.post({
                url: "/api/blog/createNew",
            }, post_params)
            .done(function(newPost) {
                console.log(newPost);
                $( '#blogEditor_selectBlog' ).append(new Option(newPost.title, newPost.blogId, true, true));
            });
        } else {
            var blogId = $("#blogEditor_selectBlog").val();
            $.post({
                url: "/api/blog/" + blogId,
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