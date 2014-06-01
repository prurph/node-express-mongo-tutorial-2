// userlist data array for filling in info box
var userListData = [];

// DOM ready =====
$(document).ready(function() {
  populateTable();

  // username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  // Add User button click
  $('#btnAddUser').on('click', addUser);
  // Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  // Hide the Edit User
  $('#editUser').hide();
  // Edit User link click
  $('#userList table tbody').on('click', 'td a.linkedituser', editUser);
});

// functions =====
function populateTable() {
  var tableContent = '';

  $.getJSON('/users/userlist')

    // once we have the JSON, add table row/cells to the content string
    .done(function(data) {

      // why not just throw the user data array into a global variable
      userListData = data;

      $.each(data, function() {
        tableContent += '<tr>';
        tableContent += '<td><a href="3" class="linkshowuser" rel="' + this.username +
          '" title="Show Details">' + this.username + '</td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
        tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
        tableContent += '</tr>';
      });

      // inject content string into existing HTML table
      $('#userList table tbody').html(tableContent);
    });
}

function showUserInfo(event) {
  event.preventDefault();

  // retrieve username from link rel attr
  var thisUserName = $(this).attr('rel');

  // retrieve index of object based on id; this would be a good spot for underscore
  // and _.pluck
  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUserName);

  // retrive user object; now we could just have used underscore and _.select
  // on the original userListData
  var thisUserObject = userListData[arrayPosition];

  // populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
  return false;
}

function addUser(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if ($(this).val() === '') { errorCount++; }
  });

  if (errorCount === 0) {
    var newUser = {
      'username': $('#inputUserName').val(),
      'email': $('#inputUserEmail').val(),
      'fullname': $('#inputUserFullname').val(),
      'age': $('#inputUserAge').val(),
      'location': $('#inputUserLocation').val(),
      'gender': $('#inputUserGender').val()
    };

    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    })
      .done(function(response) {
        if (response.msg === '') {
          $('#addUser fieldset input').val('');
          populateTable();
        }
        else {
          alert('Error: ' + response.msg);
        }
      });
  }
  // error out if errorCount is more than 0
  else {
    alert('Please fill in all fields');
    return false;
  }
}

function deleteUser(event) {
  event.preventDefault();

  var confirmation = confirm('Really delete this user?');

  if (confirmation) {
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    })
      .done(function(response) {
        if (response.msg !== '') {
          alert('Error: ' + response.msg);
        }
        populateTable();
      });
  }
  // if user didn't confirm delete, do nothing
  else {
    return false;
  }
}

function editUser(event) {
  event.preventDefault();

  var thisUserID = $(this).attr('rel');

  // retrieve index of object based on id; this would be a good spot for underscore
  // and _.pluck
  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem._id;
  }).indexOf(thisUserID);

  // retrive user object; now we could just have used underscore and _.select
  // on the original userListData
  var thisUserObject = userListData[arrayPosition];

  // populate form
  $('#inputEditUserName').val(thisUserObject.username);
  $('#inputEditUserEmail').val(thisUserObject.email);
  $('#inputEditUserFullname').val(thisUserObject.fullname);
  $('#inputEditUserAge').val(thisUserObject.age);
  $('#inputEditUserLocation').val(thisUserObject.location);
  $('#inputEditUserGender').val(thisUserObject.gender);

  $('#addUser').hide();
  $('#editUser').show();

  // unbind any previous handlers so that subsequent edits don't also edit
  // previous targets
  $('#btnEditUser').off('click');
  $('#btnEditUser').on('click', function(event) {
    // get updated user info
    event.preventDefault();

    var updatedUser = {
      'username': $('#inputEditUserName').val(),
      'email': $('#inputEditUserEmail').val(),
      'fullname': $('#inputEditUserFullname').val(),
      'age': $('#inputEditUserAge').val(),
      'location': $('#inputEditUserLocation').val(),
      'gender': $('#inputEditUserGender').val()
    };
    // update the user
    $.ajax({
      type: 'PUT',
      data: updatedUser,
      url: '/users/edituser/' + thisUserID,
      dataType: 'JSON'
    })
      .done(function(response) {
        if (response.msg !== '') {
          alert('Error: ' + response.msg);
        }
        else {
          $('#addUser').show();
          $('#editUser').hide();
        }
        populateTable();
      });
  });
}
