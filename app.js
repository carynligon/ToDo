var $inputEl = $('#user-input');
var $userInput;
var data = [];
var $taskToDelete;
var $trash = ('.trash');
var incomplete;
var complete;
var checkTask;

function renderPage() {
  if (location.hash === '#done') {
    completed = data.filter(function(item) {
      return item.completed === 'true';
    });
    $('h1').hide();
    $('#task-list').empty();
    completed.forEach(makeLI);
    $('.check').attr('checked', true);

  } else if (location.hash === '#todo') {
    incomplete = data.filter(function(item) {
      return item.completed === 'false';
    });
    $('h1').hide();
    $('#task-list').empty();
    incomplete.forEach(makeLI);

  } else if (location.hash === '#all') {
    $('h1').hide();
    $('#task-list').empty();
    data.forEach(makeLI);
  }
}

var getReq = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        data = response;
        renderPage();
    }
};


function trashHandler(e) {
    var $deleteID = $(e.target).parent('li').attr('data-id');
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

function checkboxHandler(e) {
  var $checkedID = $(e.target).parent('li').attr('data-id');
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

function uncheckHandler(e) {
  var $checkedID = $(e.target).parent('li').attr('data-id');
  var checkboxPut = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos/' + $checkedID,
    type: 'PUT',
    dataType: 'json',
    success: function(response) {
      console.log(response);
    },
    data: {
      completed: false
    }
  };
  $.ajax(checkboxPut);
  $.ajax(getReq);
  renderPage();
}


function makeLI(item, i) {
    var $newLI = $(`<li class="list-item" data-id="${item._id}"></li>`);
    $newLI.text(item.task);
    $('#task-list').append($newLI);
    if (item.completed === "false") {
      $newLI.append('<input type="checkbox" class="check" />');
    } else {
      $newLI.append('<input type="checkbox" class="check" checked="true" />');
    }
    $newLI.append('<i class="fa fa-trash-o trash" aria-hidden="true"></i>');
    $('.trash').on('click', function(e) {
        trashHandler(e);
    });
    $('.check').on('click', function(e) {
        if (!$(e.target).attr('checked')) {
        checkboxHandler(e);
      } else {
        uncheckHandler(e);
      }
    });
}

$(window).on('hashchange', function() {
  renderPage();
});

$(document).ready(function() {
  $.ajax(getReq);
  location.hash = '#home';
  $('main').prepend('<h1>Welcome Back</h1>');

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
});
