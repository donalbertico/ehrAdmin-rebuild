require('date-utils')
const paramsToQuery = (inputs) => {
  const query = { type: 'announcerContact', 'data.addId': inputs.id }
  try {
    if (inputs.from) {
      query.createdAt = { ...query.createdAt, '$gte': (new Date(inputs.from)).getTime() }
    }
    if (inputs.to) {
      query.createdAt = { ...query.createdAt, '$lte': (new Date(inputs.to)).getTime() }
    }
  } catch (e) {
    return { type: 'announcerContact', 'data.addId': inputs.id }
  }
  return query
}
module.exports = {

  friendlyName: 'Search contacs',

  description: 'Gets the registers for a contact with that announcer',

  inputs: {
    id: {
      description: 'Add id',
      type: 'string',
      required: true
    },
    from: {
      description: 'Search from this date',
      type: 'string'
    },
    to: {
      description: 'Search to this date',
      type: 'string'
    }
  },

  exits: {
    error: {
      statusCode: 500
    },
    success: {
      statusCode: 200
    },
    conflict: {
      statusCode: 409
    }
  },

  fn: function (inputs, exits) {
    const col = Stats.getDatastore().manager.collection('stats')
    col.find(paramsToQuery(inputs)).toArray((err, stats) => {
      if (err) return exits.error()
      stats = stats.map(s => {
        return {
          id: s.id,
          name: s.data.name,
          phone: s.data.phone,
          createdAt: s.createdAt
        }
      })
      return exits.success(stats)
    })
  }

}
