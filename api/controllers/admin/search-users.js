function parseQuery (inputs) {
  var query = {}
  if (inputs.email) {
    query.email = { contains: inputs.email }
  }
  if (inputs.firstName) {
    query.firstName = { contains: inputs.firstName }
  }
  if (inputs.lastName) {
    query.lastName = { contains: inputs.lastName }
  }
  if (inputs.from && inputs.to) {
    query.createdAt = { '>': inputs.from, '<': inputs.to }
  }
  if (inputs.plusState) {
    switch (inputs.plusState) {
      case 'plususer':
        query.plusUntil = { '>': (new Date()).getTime() }
        break
      case 'plusannouncer':
        query.plusAnnouncerUntil = { '>': (new Date()).getTime() }
        break
      case 'tokens':
        query.promoteTokens = { '>': 0 }
        break
    }
  }
  if (inputs.type === 'n') {
    query.collaborateWith = null
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
    email: {
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    from: {
      type: 'number'
    },
    to: {
      type: 'number'
    },
    type: {
      type: 'string'
    },
    plusState: {
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
    if (inputs.type == 'h' || inputs.type == 'r' || inputs.type == 'e') {
      const users = []
      Enterprise.count({ type: inputs.type }).exec((err, userCount) => {
        if (err) return exits.error(err)
        Enterprise.find({ type: inputs.type }).limit(limit).skip(skip).populate('collaborators').populate('deputy').exec((err, enterprises) => {
          if (err) return exits.error(err)
          enterprises.forEach((item) => {
            users.push(item.deputy)
            item.collaborators.forEach((collaborator) => {
              users.push(collaborator)
              userCount += 1
            })
          })
          exits.success({ users, total: userCount })
        })
      })
    } else {
      User.count(query).exec((err, userCount) => {
        if (err) return exits.error(err)
        User.find(query).limit(limit).skip(skip).populate('properties').populate('passports').sort('createdAt DESC').exec((err, users) => {
          if (err) return exits.error(err)
          exits.success({ users, total: userCount })
        })
      })
    }
  }
}
