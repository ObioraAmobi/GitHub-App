$(function(){
  $('#searchButton').on('click', function(e){
    e.preventDefault();
    
    var username = $('#username').val();
    var requesturl   = 'https://api.github.com/users/'+username;
    var reposurl  = 'https://api.github.com/users/'+username+'/repos';
    var starurl  = 'https://api.github.com/users/'+username+'/starred';
    
    requestJSON(requesturl, function(json) {
      if(json.message == "Not Found" || username == '') {

        $('#info').html("<p class='errorMessage'>Does not exist</p>");
      }

      
      else {
        // else we have a user and we display their info
        var username = json.login;
        var fullname = json.name;
        var bio = json.bio;
        var avatarUrl = json.avatar_url;
        var profileUrl = json.html_url;
        
        var outhtml = '<div class="row"><div class="col-md-4"><a href="'+profileUrl+'" target="_blank"><img src="'+avatarUrl+'"></a></div><div class="col-md-8">@'+username+'<br><h2>'+fullname+'</h2><br>'+bio+'</div></div>';
        // outhtml = outhtml + '<div class="row">';


        var repositories;
        $.getJSON(reposurl, function(json){
          repositories = json;
          outputPageContent();                
        });          
        
        function outputPageContent() {
          if(repositories.length == 0) { 
            outhtml = outhtml + '<div class="row"><div class="col-md-12"><p>'+username+' has no repositories!</p></div></div>'; 
          }
          else {
            outhtml = outhtml + '<div class="row"><div class="col-md-12 repo"><h3>Repositories</h3></div>';
            $.each(repositories, function(index) {
              outhtml = outhtml + '<div class="col-md-9"><p class="repoName"><strong>'+repositories[index].name+'</strong></p></div><div class="col-md-3"><i class="fa fa-star"></i> '+repositories[index].stargazers_count+' <i class="fa fa-code-fork"></i> '+repositories[index].forks_count+'</div><hr>';
            });
            outhtml = outhtml + '</div>';
          }
          $('#info').html(outhtml);
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