$(document).ready(() => {

  $("a[href='#users']").tab('show');
  $('#venueForm').validate({
    rules: {
      name: {
        required: true
      },
      keyword: {
        required: true
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
        required: true
      },
      password: {
        required: true
      },
      confirmPassword: {
        required: true
      },
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
    console.log(JSON.stringify(formData));
    $.ajax({
      url: `/api/${type}/save`,
      data: JSON.stringify(formData),
      type: reqType,
      contentType: 'application/json',
      success: (data) => {
        console.log(data);
        $("").insertBefore(`#${type}Table .final-row`);
        $(this).closest('.modal').modal('toggle');
      },
      error: (error) => {
        console.log(error);
      } 
    });
  });

  $('.edit-row').click( function() {
    console.log($(this).attr('data-section'));
    const type = $(this).data('section');
    const obj = $(this).find('input').data('object');
    console.log(obj);
    console.log(type);
    if (type === 'venue') {
      $('#venueId').val(obj._id);
      $('#venueName').val(obj.name);
      $('#venueCity').val(obj.city);
      $('#venueKeyword').val(obj.keyword);
      $('#venueState').val(obj.state);
    } else if (type === 'user') {
      console.log('made it here');
      $('#email').val(obj.email);
      $('#userId').val(obj._id);
      $('#email').attr('readonly', 'readonly');
      $(obj.perms).each(function(x, y) {
        $(`#perm${y}`).prop('checked', true);
      });
      $('#password').rules('remove');
      $('#confirmPassword').rules('remove');
    }
    $(`#${type}Modal`).modal('toggle');
  });

  
});
