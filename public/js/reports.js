$(document).ready(function() {
  $('#startDate').datetimepicker({
    timepicker: false,
    format: 'm/d/Y'
  });

  $('#endDate').datetimepicker({
    timepicker: false,
    format: 'm/d/Y'
  });

  jQuery.validator.addMethod("greaterThan",
    function (value, element, params) {

      if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(params).val());
      }
      return isNaN(value) && isNaN($(params).val())
        || (Number(value) > Number($(params).val()));
    }, 'Must be greater than {0}.');
    $("#dateForm").validate({
      rules: {
        endDate: { greaterThan: "#startDate" }
      }
    });

  $('#btn-dates').click(function() {
    const startTime = moment($('#startDate').val()).toDate();
    const endTime = moment($('#endDate').val()).toDate();
    const form = $(this).closest('form');
    if (moment(endTime).isBefore(startTime)) {
      alert('Please ensure start date is before end date.');
    } else {
      form.submit();
    }
  });
});