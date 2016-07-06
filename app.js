var $inputEl = $('#user-input');
var $userInput;
var data = [];
var $taskToDelete;
var $trash = ('.trash');
var incomplete;
var complete;

var getReq = {
    url: 'http://tiny-za-server.herokuapp.com/collections/caryns-to-dos',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        data = response;
        $('#task-list').empty();
        incomplete = data.filter(incompleteTest);
        complete = data.filter(completeTest);
        complete.forEach(makeCompletedLI);
        incomplete.forEach(makeLI);
        $('.trash').on('click', function() {
            trashHandler($(this));
        });
        $('.check').change(function() {
            if ($(this).is(':checked')) {
                checkboxHandler($(this));
            } else {
                uncheckboxHandler($(this));
            }
        });
    }
};

function completeTest(item) {
    return item.completed === 'true';
}

function incompleteTest(item) {
    return item.completed === 'false';
}

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
    $.ajax(getReq);
}

function uncheckboxHandler(item) {
    var $checkedID = data[item.parent('li').index()]._id;
    console.log($checkedID);

    var uncheckTask = {
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
    $.ajax(uncheckTask);
    $.ajax(getReq);
}

function makeLI(item, i) {
    var $newLI = $('<li class="list-item"></li>');
    $newLI.text(item.task);
    $('#task-list').append($newLI);
    $newLI.append('<input type="checkbox" class="check" />');
    $newLI.append('<i class="fa fa-trash-o trash" aria-hidden="true"></i>');
}

function makeCompletedLI(item, i) {
    var $newLI = $('<li class="list-item"></li>');
    $newLI.text(item.task);
    $('#completed-list').append($newLI);
    $newLI.append('<input type="checkbox" class="check" checked />');
    $newLI.append('<i class="fa fa-trash-o trash" aria-hidden="true"></i>');
    $('#completed-list').addClass('hide');
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

$('#view-done').on('click', function(evt) {
    $('#task-list').addClass('hide');
    $('#completed-list').removeClass('hide');
});

$('#view-todo').on('click', function(evt) {
    $('#completed-list').addClass('hide');
    $('#task-list').removeClass('hide');
});
