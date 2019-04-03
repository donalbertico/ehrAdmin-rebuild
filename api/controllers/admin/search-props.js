function parseQuery (inputs) {
  var query = {}
  if (inputs.id) {
    query.shortId = inputs.id
  }
  if (inputs.title) {
    query.title = { contains: inputs.title }
  }
  if (inputs.state !== 'a') {
    query.state = inputs.state
  }
  if (inputs.propType) {
    query.type = inputs.propType
  }
  if (inputs.from && inputs.to) {
    query.lastPublishedDate = { '>': inputs.from, '<': inputs.to }
  }
  if (Object.keys(query).length < 1) {
    return null
  }
  return query
}

module.exports = {

  friendlyName: 'Search users',

  description: 'Search users that have filelds like the inputs',

  inputs: {
    id: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    from: {
      type: 'number'
    },
    to: {
      type: 'number'
    },
    propType: {
      type: 'string'
    },
    page: {
      type: 'number'
    },
    limit: {
      type: 'number'
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
    var query = parseQuery(inputs)
    if (!query) {
      query = {}
    }
    const limit = inputs.limit || 20
    const skip = (inputs.page - 1) * limit
    Property.count(query).exec((err, count) => {
      if (err) return exits.error({ message: 'server_error' })
      Property.find(query).limit(limit).skip(skip).populate('owner').exec((err, props) => {
        if (err) return exits.error({ message: 'server_error' })
        props = props.map((item) => {
          if (item.state === 'v') {
            item.isPublished = true
          }
          if (item.publishedDates.length > 1) {
            item.state = 'r'
          }
          return item
        })
        return exits.success({ props, total: count })
      })
    })
  }
}
