// $(document).ready(() => {
//   // $('#datepicker').datepicker({
//   //   autoclose: true,
//   //   todayHighlight: true
//   // }).datepicker('update', new Date());

//   // $('input').datepicker({ dateFormat: 'dd, mm, yy' });
//   // const dateVariable = $('input').val();
//   // console.log('dateVariable', dateVariable);

//   // $('.day').click(() => {
//   //   alert('Handler for .click() called.');
//   // });
//   $('#datepicker').datepicker({ autoclose: true,
//     todayHighlight: true });

//   $('#btnD').click(() => {
//     const currentDate = $('#datepicker').datepicker('getDate');
//     console.log('#btnD', currentDate);
//   });

//   $('#btnI').click(() => {
//     const currentDate = $('#datepicker').val();
//     console.log('#btnI', currentDate);
//   });
console.log('Hello World from main.js file');

$('.modal').on('hidden.bs.modal', function () {
    $('.btn-delete').hide();
    $(this).find('input[type=text], input[type=email], input[typepassword], select').val('');
    $(this).find('input[type=text], input[type=email], input[typepassword], select').removeAttr('readonly');
    $(this).find('input[type=radio], input[type=checkbox]').prop('checked', false);
    $('.error').hide();
    if (this.id === 'venueModal') {
        $('#venueName').val('');
        $('#venueCity').val('');
        $('#venueKeyword').val('');
        $('#venueState').val('');
        $('#venueId').val('');
    } else if (this.id === 'eventModal') {
        $('#eventName').val('');
        $('#eventId').val('');
        $('#venue').val('');
        $('input[name=announcer][value=false').prop('checked', true);
        $('input[name=seatGrab][value=false').prop('checked', true);
        $('input[name=thermometer][value=false').prop('checked', true);
        $('#drawingOne').val('');
        $('#drawingTwo').val('');
        $('#drawingThree').val('');
        $('#calIndex').val(-1);
        $('#backIndex').val(-1);
    } else if (this.id === 'userModal') {
        $('#userId').val('');
        $('#email').val('');
        $('#password').val('');
        $('#confirmPassword').val('');
        $("#email").rules("add", {
            uniqueEmail: true
        });
        $("#password").rules("add", {
            required: true
        });
        $('input[type=checkbox]').prop('checked', false);
    }
})

$('.modal').on('shown.bs.modal', function () {
  if (this.id === 'userModal') {
      if ($("#userId").val() == '') {
        $('#email').val('');
        $('#password').val('');
      }
  }
})
// });
