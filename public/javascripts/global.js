// userlist data array for filling in info box
var userListData = [];

// DOM ready =====
$(document).ready(function() {
  populateTable();

  // username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
});

// functions =====
function populateTable() {
  var tableContent = '';

  // cast the jQuery AJAX call to a true promise
  Promise.cast($.getJSON('/users/userlist'))

    // once we have the JSON, add table row/cells to the content string
    .then(function(data) {

      // why not just throw the user data array into a global variable
      userListData = data;

      $.each(data, function() {
        tableContent += '<tr>';
        tableContent += '<td><a href="3" class="linkshowuser" rel="' + this.username +
          '" title="Show Details">' + this.username + '</td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
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
