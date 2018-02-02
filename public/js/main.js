if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}

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
