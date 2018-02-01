const {
  ReadPreference,
} = require('mongodb');


module.exports = venueService;

function venueService(options) {
  let Venue;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Venue = options.modelService;


  return {
    getAll,
    getAllWithDrawings,
    insert,
    getOne,
    update,
    remove,
    getStates
  };

  function getAll() {
    return Venue.find();
  }

  function getAllWithDrawings() {
    return Venue.aggregate(
      {
        $lookup:
          {
            from: 'calendar',
            localField: '_id',
            foreignField: 'venue',
            as: 'calendars'
          }
      },
      {
        $unwind: {
          path: '$calendars',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          keyword: 1,
          city: 1,
          state: 1,
          upcomingDrawings: { $cond: [{ $gte: ['$calendars.startTime', new Date()] }, 1, 0] },
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          keyword: { $first: '$keyword' },
          city: { $first: '$city' },
          state: { $first: '$state' },
          drawings: { $sum: '$upcomingDrawings' },
        }
      });
  }

  function insert(data) {
    console.log('data----',data);
    const venue = new Venue(data);
    console.log('venue---',venue);
    return venue.save();
  }

  function update(id, data) {
    delete data.id;
    return Venue.update({ _id: id }, data).exec();
  }

  function getOne(queryCondition) {
    return Venue.findOne(queryCondition);
  }

  function remove(id) {
    return Venue.remove({ _id: id });
  }

  function getStates() {
    return {
      AL: 'Alabama',
      AK: 'Alaska',
      AS: 'American Samoa',
      AZ: 'Arizona',
      AR: 'Arkansas',
      CA: 'California',
      CO: 'Colorado',
      CT: 'Connecticut',
      DE: 'Delaware',
      DC: 'District Of Columbia',
      FM: 'Federated States Of Micronesia',
      FL: 'Florida',
      GA: 'Georgia',
      GU: 'Guam',
      HI: 'Hawaii',
      ID: 'Idaho',
      IL: 'Illinois',
      IN: 'Indiana',
      IA: 'Iowa',
      KS: 'Kansas',
      KY: 'Kentucky',
      LA: 'Louisiana',
      ME: 'Maine',
      MH: 'Marshall Islands',
      MD: 'Maryland',
      MA: 'Massachusetts',
      MI: 'Michigan',
      MN: 'Minnesota',
      MS: 'Mississippi',
      MO: 'Missouri',
      MT: 'Montana',
      NE: 'Nebraska',
      NV: 'Nevada',
      NH: 'New Hampshire',
      NJ: 'New Jersey',
      NM: 'New Mexico',
      NY: 'New York',
      NC: 'North Carolina',
      ND: 'North Dakota',
      MP: 'Northern Mariana Islands',
      OH: 'Ohio',
      OK: 'Oklahoma',
      OR: 'Oregon',
      PW: 'Palau',
      PA: 'Pennsylvania',
      PR: 'Puerto Rico',
      RI: 'Rhode Island',
      SC: 'South Carolina',
      SD: 'South Dakota',
      TN: 'Tennessee',
      TX: 'Texas',
      UT: 'Utah',
      VT: 'Vermont',
      VI: 'Virgin Islands',
      VA: 'Virginia',
      WA: 'Washington',
      WV: 'West Virginia',
      WI: 'Wisconsin',
      WY: 'Wyoming'
    }
  }
}

