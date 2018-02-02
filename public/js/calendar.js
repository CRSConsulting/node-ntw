$(document).ready(function() {
  function formatForFrontend(cal) {
    return {
      title: cal.name,
      start: moment(cal.startTime).utcOffset('-0800').toDate(),
      end: moment(cal.endTime).utcOffset('-0800').toDate()
    };
  }
  let frontendArray = calendars.map(function(cal) {
    return formatForFrontend(cal);
  });
    

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
    if (drawingOne.isSame(drawingTwo) || drawingTwo.isSame(drawingThree)) {
      alert('Please ensure all drawing are at different times.');
      return false;
    }
  }

  function formatDate(id) {
    return moment($('#eventDate').val() + ' ' + $('#'+id).val(), 'M/D/YYYY h:mm A');
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
    const date = moment(time).utcOffset('-0800').toDate().toString();
    const dateparts = date.split(' ');
    return moment(dateparts[4], 'HH:mm:ss').format('h:mm A');
  }

  function showModal(date) {
    const formatDate = moment(date).format('M/D/YYYY');
    const time = formatTime(date);
    $('#eventModal #eventDate').val(formatDate);
    $('#eventModal #startTime').val(time);
    $('#eventModal').modal();
  }

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    navLinks: true, // can click day/week names to navigate views
    eventLimit: true, // allow "more" link when too many events
    dayClick: function(date, jsEvent, view) {
      showModal(date.format());
    },
    events: frontendArray,
    eventClick: function(calEvent, jsEvent, view) {
      $('.btn-delete').show();
      const backIndex = calendars.findIndex(function(cal) {
        return cal.name === calEvent.title && moment(cal.startTime).isSame(calEvent.start);
      });
      const caldate = calendars[backIndex];
      const objIndex = frontendArray.findIndex(function(obj) {
        return obj.title === calEvent.title && moment(calEvent.start).isSame(obj.start)
      });

      $('#eventId').val(caldate._id);
      $('#eventName').val(caldate.name);
      $('#venue').val(caldate.venue);
      $('#calIndex').val(objIndex);
      $('#backIndex').val(backIndex);
      $('.hidden').show();
      $('input[name=announcer][value='+caldate.announcer).prop('checked', true);
      $('input[name=seatGrab][value='+caldate.seatGrab).prop('checked', true);
      $('input[name=thermometer][value='+caldate.thermometer).prop('checked', true);
      $('#drawingOne').val(formatTime(caldate.drawings[0].time));
      $('#drawingTwo').val(formatTime(caldate.drawings[1].time));
      $('#drawingThree').val(formatTime(caldate.drawings[2].time));
      showModal(caldate.startTime);
    }
  });

  $('.btn-delete').click(function () {
    const type = $(this).attr('section');
    const id = $('#eventId').val();
    let r = false;
    const calIndex = $('#calIndex').val();
    const backIndex = $('#backIndex').val();
    const deleteCalendar = calendars[backIndex];
    r = confirm('Are you sure you wish to delete event: '+deleteCalendar.name+'?');

    if (r === true) {
      $.ajax({
        url: '/api/'+type+'/save',
        data: JSON.stringify({ id : id }),
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data) {
          console.log(data);
          calendars.splice(backIndex,1);
          frontendArray.splice(calIndex,1);
          $('#calendar').fullCalendar('removeEvents');
          $('#calendar').fullCalendar('addEventSource', frontendArray);
          $('#calendar').fullCalendar('refetchEvents');
          $(this).closest('.modal').modal('toggle');
          alert('Event successfully deleted');
        },
        error: function(error) {
          console.log(error);
        }
      });
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
    const backIndex = $('#backIndex').val();
    const conflictingEvent = calendars.find(function(calendar, index) {
      return index !== parseInt(backIndex) && calendar.venue === newForm.venue && (moment(calendar.startTime).isSame(newForm.startTime) || moment(calendar.startTime).isBetween(newForm.startTime, newForm.endTime) || moment(newForm.startTime).isBetween(calendar.startTime, calendar.endTime));
    });
    console.log(conflictingEvent);
    if (conflictingEvent) {
      alert('The event '+conflictingEvent.name+' is already ongoing at the venue you have selected at the times you have selected. Please choose a different venue or start time for this event.');
      return;
    }
    let reqType = 'POST';
    if ($('#eventId').val() !== '' && $('#eventId').val() !== undefined) {
      newForm.id = $('#eventId').val();
      reqType = 'PATCH';
      console.log($('#eventId').val());
      const oldEvent = calendars[backIndex];
      if (newForm.name !== oldEvent.name) {
        if (oldEvent.updateName) {
          newForm.updateName = oldEvent.updateName;
          newForm.updateName.push(oldEvent.name);
        } else {
          newForm.updateName = [oldEvent.name];
        }
      }
      if (moment(newForm.startTime).diff(oldEvent.startTime, 'days') !== 0) {
        if (oldEvent.updateDate) {
          newForm.updateDate = oldEvent.updateDate;
          newForm.updateDate.push(oldEvent.startTime);
        } else {
          newForm.updateDate = [oldEvent.startTime];
        }
      }
    }
    console.log(newForm);
    $.ajax({
      url: '/api/'+type+'/save',
      data: JSON.stringify(newForm),
      type: reqType,
      contentType: 'application/json',
      success: function(data) {
        if (data.msg) {
          alert('The update was unable to be saved. Please contact an administrator.');
          return;
        }
        console.log(data);
        $(this).closest('.modal').modal('toggle');
        const newCalEvent = formatForFrontend(data);
        if (reqType === 'POST') {
          frontendArray.push(newCalEvent);
          calendars.push(data);
        } else {
          console.log('it was a patch job');
          const objIndex = $('#calIndex').val();
          const backIndex = $('#backIndex').val();
          console.log(objIndex);
          console.log(frontendArray);
          //Update object's name property.
          frontendArray[objIndex] = newCalEvent;
          calendars[backIndex] = data;
        }
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', frontendArray);
        $('#calendar').fullCalendar('refetchEvents');
        console.log('attempted refetch');
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
});


