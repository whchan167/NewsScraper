  $(document).on("click", "#start", function(){
    $("#comment").hide();
$.getJSON('/article', function(data) {
  for (var i = 0; i<data.length; i++){
  $('#article').append('<h3 data-id="' + data[i]._id + '">'+ 
                          data[i].title + '</h3><br><a href="'+ 
                          data[i].link + '"><button class="btn btn-info btn-lg">Read Article</button></a>'
                          +'<button data-id="'+ data[i]._id +'" type="submit" class="btn btn-lg">Article Note</button>');
                          }
                    });
                });

$(document).on('click', "button", function(){
  $("#comment").show();
  $('#comment').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/article/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#comment').append('<h2>' + data.title + '</h2>');

      $('#comment').append('<input id="titleinput" name="title" >');

      $('#comment').append('<textarea id="bodyinput" name="body"></textarea>');

      $('#comment').append('<button data-id="' + data._id + '" id="savecomment">Save comment</button>');

      if(data.comment){
        console.log(data.comment);

        $('#comment').append('<button data-id="' + data.comment._id + '" id="deletecomment">Delete comment</button>');

        $('#titleinput').val(data.comment.title);

        $('#bodyinput').val(data.comment.body);

      }
    });
});

// Click delete note

$(document).on('click', '#deletecomment', function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);

  $.ajax({
    method: "POST",
    url: "/deletecomment/" + thisId
  }).done(function() {
      //input title and body from comment
      $('#titleinput').val("");
      $('#bodyinput').val("");
  });
});

$(document).on('click', '#savecomment', function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);

  $.ajax({
    method: "POST",
    url: "/article/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  }).done(function( data ) {
      console.log(data);
    //   $('#comment').empty();
    // });
      $('#titleinput').val("");
      $('#bodyinput').val("");
  });
});    

