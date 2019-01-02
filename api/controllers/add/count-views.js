require('date-utils')
module.exports = {

  friendlyName: 'Count Add views',

  description: 'Counts all the views from this add.',

  inputs: {
    id: {
      type: 'string',
      required: true
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
    const aMonthAgo = (new Date()).remove({ months: 1 }).setDate(1)
    const startOfThisMonth = (new Date()).setDate(1)
    col.find({ type: 'announcerContact', 'data.addId': inputs.id, createdAt: { '$gt': aMonthAgo } }).toArray((err, stats) => {
      if (err) return exits.error()
      const response = {
        lastMonth: 0,
        thisMonth: 0
      }
      stats.forEach(s => {
        if (s.createdAt > aMonthAgo && s.createdAt < startOfThisMonth) {
          response.lastMonth += 1
        } else if (s.createdAt > startOfThisMonth) {
          response.thisMonth += 1
        }
      })
      return exits.success(response)
    })
  }

}
