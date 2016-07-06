var $inputEl = $('#user-input');
var $userInput;
var data = [];

function makeLI(item, i) {
  var $newLI = $('<li class="list-item"></li>');
  $newLI.text(item.task);
  $('#task-list').append($newLI);
  $newLI.append('<input type="checkbox" id="check" />');
  $newLI.append('<i class="fa fa-trash-o" id="trash" aria-hidden="true"></i>');
}

var getReq = {
url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
type: 'GET',
dataType: 'json',
success: function (response) {
  data = response;
  $('#task-list').empty();
  data.forEach(makeLI);
  }
};

$.ajax(getReq);



$inputEl.on('keyup', function (evt) {
  if (evt.which === 13) {
    $userInput = $inputEl.val();
    $.ajax({
      url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
      type: 'POST',
      dataType: 'json',
      success: function(response) {
        console.log(response);
      },
      data: {
        task: $userInput,
        completed: false
      }
    });
    $.ajax(getReq);
  }
});

$('#trash').on('click', function() {
  
});
