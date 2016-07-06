var $inputEl = $('#user-input');
var $userInput;
var data = [];
var $taskToDelete;
var $trash = ('.trash');

var getReq = {
url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
type: 'GET',
dataType: 'json',
success: function (response) {
  data = response;
  $('#task-list').empty();
  data.forEach(makeLI);
  $('.trash').on('click', function () {
    trashHandler($(this));
  });
  $('.check').change(function (){
    if ($(this).is(':checked')) {
      checkboxHandler($(this));
    }
  });
  }
};

function trashHandler (item) {
  var $deleteID = data[item.parent('li').index()]._id;

  var deleteTask = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos/' + $deleteID,
    type: 'DELETE',
    dataType: 'json',
    success: function (response) {
      console.log(response);
      }
  };

  $.ajax(deleteTask);
  $.ajax(getReq);
}

function checkboxHandler (item) {
  var $checkedID = data[item.parent('li').index()]._id;
  console.log($checkedID);

  var checkTask = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos/' + $checkedID,
    type: 'PUT',
    dataType: 'json',
    success: function(response) {
      console.log(response);
    },
    data: {
      completed: true
    }
  };
  $.ajax(checkTask);
}

function makeLI(item, i) {
  var $newLI = $('<li class="list-item"></li>');
  $newLI.text(item.task);
  $('#task-list').append($newLI);
  $newLI.append('<input type="checkbox" class="check" />');
  $newLI.append('<i class="fa fa-trash-o trash" aria-hidden="true"></i>');
}

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
