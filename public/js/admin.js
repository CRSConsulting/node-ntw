$(document).ready(function() {
  let venueIndex = 0;
  let userIndex = 0;
  $("a[href='#users']").tab('show');
  jQuery.validator.addMethod("keyword", function (value, element) {
    // allow any non-whitespace characters as the host part
    return /^[a-zA-Z_]*$/.test(value);
  }, 'Please enter alphabetical characters only.');
  jQuery.validator.addMethod("uniqueEmail", function (value, element) {
    // allow any non-whitespace characters as the host part
    const foundUser = users.find(function(user) {
       return user.email === value
    });
    return !foundUser;
  }, 'Please enter a unique email.');
  $('#venueForm').validate({
    rules: {
      name: {
        required: true
      },
      keyword: {
        required: true,
        keyword: true
      },
      city: {
        required: true
      },
      state: {
        required: true
      },
    }
  });

  $('#userForm').validate({
    rules: {
      email: {
        required: true,
        email: true,
        uniqueEmail: true
      },
      password: {
        required: true,
        minlength: 4
      },
      confirmPassword: {
        equalTo: '#password'
      },
    }
  });

  $('.btn-delete').click(function() {
    const type = $(this).attr('section');
    const id = $('#'+type+'Id').val();
    let r = false;
    if (type === 'venue') {
      const deleteVenue = venues.find(function(venue) {
       return venue._id === id
      });
      if (deleteVenue.drawings > 0) {
        const s = deleteVenue.drawings > 1 ? 's' : '';
        alert('This venue currently has '+deleteVenue.drawings+' upcoming event${s}. Please remove upcoming events from the calendar before deleting a venue.');
        return;
      }
      r = confirm('Are you sure you wish to delete '+type+': '+deleteVenue.name+'?');
    } else if (type === 'user') {
      const deleteUser = users.find(function(user) {
         return user._id === id
      });
      r = confirm('Are you sure you wish to delete '+type+': ${deleteUser.email}?');
    }

    if (r === true) {
      $.ajax({
        url: '/api/'+type+'/save',
        data: JSON.stringify({ id : id }),
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data) {
          console.log(data);
          if (type === 'venue') {
            venues = venues.filter(function(venue) {
              return venue._id !== id
            });
            const row = $('#venueTable').find('tr').eq(venueIndex);
            row.remove();
            alert('Venue successfully deleted.');
          } else if (type === 'user') {
            users = users.filter(function(user){ 
              return user._id !== id
            });
            const row = $('#userTable').find('tr').eq(userIndex);
            row.remove();
            alert('User successfully deleted.');
          }
          $(this).closest('.modal').modal('toggle');

        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  });

  $('.btn-save').click( function () {
    if ($(this).closest('form').valid() === false) {
      return;
    }
    const type = $(this).attr('section');
    const form = $(this).closest('form');
    const formData = form.serializeJSON();
    let reqType = 'POST';
    if (formData.id && formData.id !== '') {
      reqType = 'PATCH';
    } 
    if (type === 'venue') {
      const findDupeName = venues.findIndex(function(venue) {
        return venue.name.toUpperCase() === formData.name.toUpperCase() && (!formData.id || formData.id === '' || formData.id !== venue._id);
      });
      const findDupeKeyword = venues.find(function(venue) {
        return venue.keyword.toUpperCase() === formData.keyword.toUpperCase() && (!formData.id || formData.id === '' || formData.id !== venue._id);
      });
      if (findDupeName > -1) {
        alert('There is already a venue with the name '+formData.name+'.');
        return;
      } else if (findDupeKeyword) {
        alert('The Keyword '+formData.keyword+' is already in use by the Venue ${findDupeKeyword.name}. Please choose a different keyword.');
        return;
      }
    }
    console.log(JSON.stringify(formData));
    $.ajax({
      url: '/api/'+type+'/save',
      data: JSON.stringify(formData),
      type: reqType,
      contentType: 'application/json',
      success: function(data) {
        console.log(data);
        if (reqType === 'POST') {
          let newRow;
          if (type === 'venue') {
            delete data.__v;
            console.log(JSON.stringify(data));
            venues.push(data);
            newRow = "<tr class='edit-row' data-section='venue' data-id="+data._id+"><td>"+data.name+"</td><td>"+data.keyword+"</td><td>0</td></tr>";
          } else if (type === 'user') {
            users.push(data);
            newRow = "<tr class='edit-row' data-section='user' data-id="+data._id+"><td>"+data.email+"</td></tr>";
          }
          $(newRow).insertBefore('#'+type+'Table .final-row');
        } else if (reqType === 'PATCH' ) {
          if (type === 'venue') {
            const row = $('#venueTable').find('tr').eq(venueIndex);
            $(row).find('td').eq(0).html(data.name);
            $(row).find('td').eq(1).html(data.keyword);
            const findVenue = venues.findIndex(function(venue) {
              return venue._id === data._id
            });
            venues[findVenue] = data;
          } else if (type === 'user') {
            const findUser = users.findIndex(function(user) {
              return user._id === data._id
            });
            users[findUser] = data;
          }
        }
        console.log($(this).closest('.modal'));
        $('#' + type + 'Modal').modal('toggle');
      },
      error: function(error) {
        console.log(error);
      } 
    });
  });
$(function () {
  $(document).on('click', '.edit-row', (function() {
    $('.btn-danger').show();
    console.log('hi');
    const type = $(this).data('section');
    const objId = $(this).data('id');
    if (type === 'venue') {
      const obj = venues.find(function(venue) {
        return venue._id === objId
      });
      console.log(obj);
      $('#venueId').val(obj._id);
      $('#venueName').val(obj.name);
      $('#venueCity').val(obj.city);
      $('#venueKeyword').val(obj.keyword);
      $('#venueState').val(obj.state);
      venueIndex = $('#venueTable tr').index(this);
    } else if (type === 'user') {
      const obj = users.find(function(user) {
        return user._id === objId
      });
      console.log(obj);
      $('#email').val(obj.email);
      $('#userId').val(obj._id);
      $('#email').attr('readonly', 'readonly');
      $(obj.perms).each(function(x, y) {
        $('#perm'+y).prop('checked', true);
      });
      $('#email').rules('remove', 'uniqueEmail');
      $('#password').rules('remove', 'required');
      userIndex = $('#userTable tr').index(this);

    }
    console.log('hello');
    console.log('#' + type + 'Modal');
    $('#'+type+'Modal').modal('toggle');
  }))
})
});
