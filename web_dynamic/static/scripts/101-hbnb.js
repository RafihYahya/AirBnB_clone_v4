$(document).ready(function () {
  const AmenitiesChecked = {};
  const StatesCheked = {};
  const CitiesChecked = {};
  const CheckedLoactions = {};
  const StateId = {};
  $(document).on('change', ".amenities input[type='checkbox']", function () {
    if (this.checked) {
      AmenitiesChecked[$(this).data('id')] = $(this).data('name');
    } else {
      delete AmenitiesChecked[$(this).data('id')];
    }
    const lobj = Object.values(AmenitiesChecked);
    if (lobj > 0) {
      $('div.amenities > h4').text(Object.values(AmenitiesChecked).join(','));
    } else {
      $('div.amenities >h4').html('&nbsp;');
    }
  });

  const states = $(".locations > .popover > li > input[type='checkbox']");
  states.on('change', function () {
    const l = $(this).data('id');
    if (this.checked) {
      StatesCheked[$(this).data('id')] = $(this).data('name');
      CheckedLoactions[$(this).data('id')] = $(this).data('name');
    } else {
      delete StatesCheked[$(this).data('id')];
      delete CheckedLoactions[$(this).data('id')];
    }
    const lobj = Object.values(CheckedLoactions);
    if (lobj > 0) {
      $('div.locations > h4').text(lobj.join(','));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
    if ((this.checked) === false) {
      const l = $(this).data('id');
      let n = 0;
      $.each(StateId, function (key, value) {
        if (value === l) {
          n++;
          $('.locations > .popover > li > ul > li > input:checkbox[data-id^="' + key + '"]').prop('checked', false);
          delete CitiesChecked[key];
          delete CheckedLoactions[key];
          delete StateId[key];
        }
      });
    }
    console.log(CitiesChecked);
    console.log(StateId);
    console.log(CheckedLoactions);
  });

  $(document).on('change', ".locations > .popover > li > ul > li > input[type='checkbox']", function () {
    if (this.checked) {
      CitiesChecked[$(this).data('id')] = $(this).data('name');
      CheckedLoactions[$(this).data('id')] = $(this).data('name');
      StateId[$(this).data('id')] = $(this).attr('data-state');
    } else {
      delete CitiesChecked[$(this).data('id')];
      delete CheckedLoactions[$(this).data('id')];
      delete StateId[$(this).data('id')];
    }
    const lobj = Object.values(CheckedLoactions);
    if (lobj > 0) {
      $('div.locations > h4').text(lobj.join(','));
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
    const l = $(this).attr('data-state');
    let n = 0;
    $.each(StateId, function (key, value) {
      if (value === l) {
        n++;
      }
    });
    console.log(n);
    if (n === 0) {
      const l = $(this).attr('data-state');
      $('.locations > .popover > li > input:checkbox[data-id^="' + l + '"]').prop('checked', true);
      $.getJSON('http://172.23.179.134:5001/api/v1/states/' + $(this).attr('data-state'), (state) => {
        StatesCheked[state.id] = state.name;
        CheckedLoactions[state.id] = state.name;
      });
    } else if (n > 0) {
      const l = $(this).attr('data-state');
      $('.locations > .popover > li > input:checkbox[data-id^="' + l + '"]').prop('checked', true);
      delete StatesCheked[$(this).attr('data-state')];
      delete CheckedLoactions[$(this).attr('data-state')];
    }
    console.log(StatesCheked);
  });

  const url = 'http://172.23.179.134:5001/api/v1/status/';
  $.getJSON(url, (data) => {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  const users = {};
  $.getJSON('http://172.23.179.134:5001/api/v1/users', (data) => {
    for (const usr of data) {
      users[usr.id] = usr.first_name + ' ' + usr.last_name;
    }
  });
  const amenities = {};
  $.getJSON('http://172.23.179.134:5001/api/v1/amenities', (data) => {
    for (const amenity of data) {
      amenities[amenity.id] = amenity.name;
    }
  });
  console.log(amenities);

  $.ajax({
    type: 'POST',
    data: JSON.stringify({}),
    url: 'http://172.23.179.134:5001/api/v1/places_search/',
    contentType: 'application/json',
    success: data => {
      for (const place of data) {
        const template = `<article>
      <div class="title">
        <h2>${place.name}</h2>
        <div class="price_by_night">
    $${place.price_by_night}
          </div>
        </div>
        <div class="information">
          <div class="max_guest">
          <div class="image_guest"></div>
    <br />
    ${place.max_guest} Guests
        </div>
          <div class="number_rooms">
          <div class="img_room"></div>
    <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
    <br />
    ${place.number_rooms} Bedrooms
        </div>
        <div class="number_bathrooms">
        <div class="img_bathrooms"></div>
    <br />
    ${place.number_bathrooms} Bathroom
        </div>
      </div>
    <!-- USER -->
    <div class="user">
    <p><b>Owner: </b>${users[place.user_id]}</p>
    </div>
      <div class="description">
        ${place.description}
      </div>
      <div class="reviews" data-id="${place.id}">
      <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
      <ul data-id="${place.id}">
      </ul>
    </article> <!-- End 1 PLACE Article -->`;
        $('section.places').append(template);
      }
      $('.reviewSpan').click(function (event) {
        $.ajax('http://172.23.179.134:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews').done(function (data) {
          const FirstPlace = data[0];
          //            $('span').toggle('reviewSpan hideReview');\
          if ($("span[data-id='" + FirstPlace.place_id + "']").hasClass('hideReview') === false) {
            for (const review of data) {
              $(".reviews ul[data-id='" + review.place_id + "']").append(`<li>${review.text}</li>`);
            }
            $("span[data-id='" + FirstPlace.place_id + "']").addClass('hideReview');
            $("span[data-id='" + FirstPlace.place_id + "']").text('hide');
          } else if ($("span[data-id='" + FirstPlace.place_id + "']").hasClass('hideReview') === true) {
            const FirstPlace = data[0];
            $(".reviews ul[data-id='" + FirstPlace.place_id + "']").empty();
            $("span[data-id='" + FirstPlace.place_id + "']").removeClass('hideReview');
            $("span[data-id='" + FirstPlace.place_id + "']").text('show');
          }
        });
      });
    }
  });

  $('button').click(function () {
    $('.places > article').remove();
    $.ajax({
      type: 'POST',
      data: JSON.stringify({ amenities: Object.keys(AmenitiesChecked), states: Object.keys(StatesCheked), cities: Object.keys(CitiesChecked) }),
      url: 'http://172.23.179.134:5001/api/v1/places_search/',
      dataType: 'json',
      contentType: 'application/json',
      success: data => {
        for (const place of data) {
          const template = `<article>
      <div class="title">
        <h2>${place.name}</h2>
        <div class="price_by_night">
    $${place.price_by_night}
          </div>
        </div>
        <div class="information">
          <div class="max_guest">
          <div class="image_guest"></div>
    <br />
    ${place.max_guest} Guests
        </div>
          <div class="number_rooms">
          <div class="img_room"></div>
    <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
    <br />
    ${place.number_rooms} Bedrooms
        </div>
        <div class="number_bathrooms">
        <div class="img_bathrooms"></div>
    <br />
    ${place.number_bathrooms} Bathroom
        </div>
      </div>
    <!-- USER -->
    <div class="user">
    <p><b>Owner: </b>${users[place.user_id]}</p>
    </div>
      <div class="description">
        ${place.description}
      </div>
      <div class="reviews" data-id="${place.id}">
      <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
      <ul data-id="${place.id}">
      </ul>
    </article> <!-- End 1 PLACE Article -->`;
          $('section.places').append(template);
        }
        $('.reviewSpan').click(function (event) {
          $.ajax('http://172.23.179.134:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews').done(function (data) {
            const FirstPlace = data[0];
            //            $('span').toggle('reviewSpan hideReview');\
            if ($("span[data-id='" + FirstPlace.place_id + "']").hasClass('hideReview') === false) {
              for (const review of data) {
                $(".reviews ul[data-id='" + review.place_id + "']").append(`<li>${review.text}</li>`);
              }
              $("span[data-id='" + FirstPlace.place_id + "']").addClass('hideReview');
              $("span[data-id='" + FirstPlace.place_id + "']").text('hide');
            } else if ($("span[data-id='" + FirstPlace.place_id + "']").hasClass('hideReview') === true) {
              const FirstPlace = data[0];
              $(".reviews ul[data-id='" + FirstPlace.place_id + "']").empty();
              $("span[data-id='" + FirstPlace.place_id + "']").removeClass('hideReview');
              $("span[data-id='" + FirstPlace.place_id + "']").text('show');
            }
          });
        });
      }
    });
  });
});
