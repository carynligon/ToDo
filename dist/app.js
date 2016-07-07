var $inputEl = $('#user-input');
var $userInput;
var data = [];
var $taskToDelete;
var $trash = ('.trash');
var incomplete;
var complete;
var checkTask;

var getReq = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        data = response;
        $('#task-list').empty();
        data.forEach(makeLI);
        $('.trash').on('click', function() {
            trashHandler($(this));
        });
        $('.check').on('click', function() {
            checkboxHandler($(this));
        });
    }
};


function trashHandler(item) {
    var $deleteID = data[item.parent('li').index()]._id;

    var deleteTask = {
        url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos/' + $deleteID,
        type: 'DELETE',
        dataType: 'json',
        success: function(response) {
            console.log(response);
        }
    };

    $.ajax(deleteTask);
    $.ajax(getReq);
}

function checkboxHandler(item) {
  var $checkedID = data[item.parent('li').index()]._id;
  console.log($checkedID);
  var checkboxPut = {
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
  $.ajax(checkboxPut);
  $.ajax(getReq);
}


function makeLI(item, i) {
    var $newLI = $('<li class="list-item"></li>');
    $newLI.text(item.task);
    $('#task-list').append($newLI);
    $newLI.append('<input type="checkbox" class="check" />');
    $newLI.append('<i class="fa fa-trash-o trash" aria-hidden="true"></i>');
}

$.ajax(getReq);


$inputEl.on('keyup', function(evt) {
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

$(document).ready(function() {
  window.location.hash = '#home';
});

window.addEventListener('hashchange', function () {
  if (location.hash === '#done') {
    completed = data.filter(function(item) {
      return item.completed === 'true';
    });
    $('#task-list').empty();
    completed.forEach(makeLI);
  } else if (location.hash === '#todo') {
    incomplete = data.filter(function(item) {
      return item.completed === 'false';
    });
    $('#task-list').empty();
    incomplete.forEach(makeLI);
  } else if (location.hash === '#all') {
    $('#task-list').empty();
    data.forEach(makeLI);
  }
});
