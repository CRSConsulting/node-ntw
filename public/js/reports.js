$(document).ready(function() {
  $('#startDate').datetimepicker({
    timepicker: false,
    format: 'm/d/Y'
  });

  $('#endDate').datetimepicker({
    timepicker: false,
    format: 'm/d/Y'
  });

  $('#btn-run').click(function() {
    const startTime = moment($('#startDate').val()).toDate();
    const endTime = moment($('#endDate').val()).toDate();
    const form = $(this).closest('form');
    if (moment(startDate).isBefore(endDate)) {
      form.submit();
    } else {
      alert('Please ensure the End Date is after the Start Date');
    }
  });
});