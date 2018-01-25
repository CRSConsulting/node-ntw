$(document).ready(() => {
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
  })


  $('.btn-save').click( function () {
    if ($(this).closest('form').valid() === false) {
      return;
    }
    const type = $(this).attr('section');
    const form = $(this).closest('form');
    const formData = getFormData(form);
    let reqType = 'POST';
    if (form.id && form.id !== '') {
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
        $(this).closest('.modal').modal('toggle');
      },
      error: (error) => {
        console.log(error);
      } 
    });
  });

  $('.edit-row').click( function() {
    const type = $(this).data('section');
    const obj = $(this).find('input').data('object');
    console.log(obj);
    if (type === 'venue') {
      $('#venueId').val(obj._id);
      $('#venueName').val(obj.name);
      $('#venueCity').val(obj.city);
      $('#venueKeyword').val(obj.keyword);
      $('#venueState').val(obj.state);
    }
    $(`#${type}Modal`).modal('toggle');
  });

  
});
