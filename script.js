$(function(){
  $('#searchButton').on('click', function(e){
    e.preventDefault();
    
    var username = $('#usernameInput').val();
    var requesturl   = 'https://api.github.com/users/'+username;
    var reposurl  = 'https://api.github.com/users/'+username+'/repos';
    var starurl  = 'https://api.github.com/users/'+username+'/starred';
    
    requestJSON(requesturl, function(json) {
      if(json.message == "Not Found" || username == '') {

        $('#info').html("<div class='errorMessage'>Does not exist</div>");
      }

      
      else {
        // else we have a user and we display their info
        var username = json.login;
        var fullname = json.name;
        var bio = json.bio;
        var avatarUrl = json.avatar_url;
        var profileUrl = json.html_url;

        if (bio == null) {
          bio = "this is the bio...";
        };
        
        var guiHtml = '<div class="userInfo"><a href="'+profileUrl+'" target="_blank"><img src="'+avatarUrl+'"></a><div class="userDetails"><i>@'+username+'</i><br><span class="userFullname">'+fullname+'</span><br><span class="bio">'+bio+'</span></div></div>';
        guiHtml = guiHtml + '<table class="reposTable">';

        var repositories;
        $.getJSON(reposurl, function(json){
          repositories = json;
          outputPageContent();                
        });          
        
        function outputPageContent() {
          if(repositories.length == 0) { 
            guiHtml = guiHtml + '<div class="errorMessage"><p>'+username+' has no repositories!</p></div>'; 
          }
          else {
            guiHtml = guiHtml + '<thead class="theader"><tr><th><h3>Repositories</h3></th></tr></thead>';
            $.each(repositories, function(index) {
              guiHtml = guiHtml + '<tbody><td class="repoDetails"><span class="repoName">'+repositories[index].name+'</span><span class="starForkTally"><span class="stars"><i class="fa fa-star"></i> '+repositories[index].stargazers_count+' </span><span class="fork"><i class="fa fa-code-fork"></i> '+repositories[index].forks_count+'</span></span></td><tbody>';
            });
            guiHtml = guiHtml + '</table>';
          }
          $('#info').html(guiHtml);
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
  }); // end click event handler
  
  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
  }
});