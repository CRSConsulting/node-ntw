

$(document).ready(() => {
  function formatForFrontend(cal) {
    return {
      title: cal.name,
      start: moment(cal.startTime).utcOffset('-0800').toDate(),
      end: moment(cal.endTime).utcOffset('-0800').toDate()
    };
  }
  let frontendArray = [];
  function generateFA() {
    frontendArray = calendars.map((cal) => {
      return formatForFrontend(cal);
    });
    return frontendArray;
  }

  function checkDrawingTimes() {
    const startTime = formatDate('startTime');
    const drawingOne = formatDate('drawingOne');
    const drawingTwo = formatDate('drawingTwo');
    const drawingThree = formatDate('drawingThree');
    if (drawingOne.isBefore(startTime) || drawingTwo.isBefore(drawingOne) || drawingThree.isBefore(drawingTwo)) {
      if (drawingOne.isBefore(startTime)) {
        alert('Please ensure the first drawing is after the event start time.');
      } else if (drawingTwo.isBefore(drawingOne)) {
        alert('Please ensure the second drawing is after the first drawing.');
      } else if (drawingThree.isBefore(drawingTwo)) {
        alert('Please ensure the third drawing is after the second drawing.');
      }
      return false;
    }
  }

  function formatDate(id) {
    return moment($('#eventDate').val() + ' ' + $(`#${id}`).val(), 'M/D/YYYY h:mm A');
  }

  

  $('#eventForm').validate({
    rules: {
      eventDate: {
        required: true
      },
      name: {
        required: true
      },
      venue: {
        required: true
      },
      startTime: {
        required: true
      },
      drawingOne: {
        required: true
      },
      drawingTwo: {
        required: true
      },
      drawingThree: {
        required: true
      },
    }
  });

  $('#eventDate').datetimepicker({
    timepicker: false,
    format: 'm/d/Y'
  });

  function formatTime(time) {
    const date = moment(time).utcOffset('-0800').format('YYYY-MM-DDTHH:mm:ss.SSSSZ');
    const dateparts = date.split('T');
    return moment(dateparts[1], 'HH:mm:ss').format('h:mm A');
  }

  function showModal(date) {
    const dateparts = date.split('T');
    const formatDate = moment(dateparts[0]).format('M/D/YYYY');
    const formatTime = moment(dateparts[1], 'HH:mm:ss').format('h:mm A');
    $('#eventModal #eventDate').val(formatDate);
    $('#eventModal #startTime').val(formatTime);
    $('#eventModal').modal();
  }

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    dayClick: (date, jsEvent, view) => {
      if (view.name === 'agendaDay') {
        showModal(date.format());
      }
    },
    events: generateFA(),
    eventClick: (calEvent, jsEvent, view) => {
      const caldate = calendars.find((cal) => {
        return cal.name === calEvent.title && moment(cal.startTime).isSame(calEvent.start);
      });
      $('#eventId').val(caldate._id);
      $('#eventName').val(caldate.name);
      $('#venue').val(caldate.venue);
      $(`input[name=announcer][value=${caldate.announcer}`).prop('checked', true);
      $(`input[name=seatGrab][value=${caldate.seatGrab}`).prop('checked', true);
      $(`input[name=thermometer][value=${caldate.thermometer}`).prop('checked', true);
      $('#drawingOne').val(formatTime(caldate.drawings[0].time));
      $('#drawingTwo').val(formatTime(caldate.drawings[1].time));
      $('#drawingThree').val(formatTime(caldate.drawings[2].time));
      showModal(caldate.startTime);
    }
  });

  $('.btn-save').click(function () {
    if ($(this).closest('form').valid() === false) {
      return;
    }
    if (checkDrawingTimes() === false) {
      return;
    }
    const type = $(this).attr('section');
    const form = $(this).closest('form');
    const newForm = {
      name: $('#eventName').val(),
      venue: $('#venue').val(),
      startTime: formatDate('startTime').toDate(),
      endTime: formatDate('drawingThree').add(1,'h').toDate(),
      announcer: $('[name=announcer]:checked').val(),
      seatGrab: $('[name=seatGrab]:checked').val(),
      thermometer: $('[name=thermometer]:checked').val(),
      drawings: [
        {
          time: formatDate('drawingOne').toDate(),
        },
        {
          time: formatDate('drawingTwo').toDate(),
        },
        {
          time: formatDate('drawingThree').toDate(),
        },
      ]
    };
    let reqType = 'POST';
    if ($('#id').val() !== '' && $("#id").val() !== undefined) {
      newForm.id = $('#id').val();
      reqType = 'PATCH';
    }
    console.log(newForm);
    $.ajax({
      url: `/api/${type}/save`,
      data: JSON.stringify(newForm),
      type: reqType,
      contentType: 'application/json',
      success: (data) => {
        console.log(data);
        $(this).closest('.modal').modal('toggle');
        const newCalEvent = formatForFrontend(data);
        if (reqType === 'POST') {
          $('#calendar').fullCalendar('renderEvent', newCalEvent);
        } else {
          const objIndex = frontendArray.findIndex((obj => obj.title === newCalEvent.title && moment(newCalEvent.start).isSame(obj.start)));
          //Update object's name property.
          frontendArray[objIndex] = newCalEvent;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  });
});


