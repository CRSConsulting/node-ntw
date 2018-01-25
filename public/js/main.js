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

function getFormData($form) {
  const unindexedArray = $form.serializeArray();
  const indexedArray = {};

  $.map(unindexedArray, (n) => {
    indexedArray[n.name] = n.value;
  });

  return indexedArray;
}

$('.modal').on('hidden.bs.modal', function () {
    if (this.id == 'venueModal') {
        $('#venueName').val('');
        $('#venueCity').val('');
        $('#venueKeyword').val('');
        $('#venueState').val('');
        $('#venueId').val('');
    } else if (this.id == 'eventModal') {
        $('#eventName').val('');
        $('#venue').val('');
        $('input[name=announcer][value=false').prop('checked', true);
        $('input[name=seatGrab][value=false').prop('checked', true);
        $('input[name=thermometer][value=false').prop('checked', true);
        $('#drawingOne').val('');
        $('#drawingTwo').val('');
        $('#drawingThree').val('');
    }
})
// });
