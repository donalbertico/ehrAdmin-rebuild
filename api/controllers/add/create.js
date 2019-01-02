module.exports = {

  friendlyName: 'Create Add ',

  description: 'Creates a new add',

  inputs: {
    title: { type: 'string', required: true },
    type: { type: 'string', required: true },
    contactEmail: { type: 'string', required: true },
    description: { type: 'string', required: true },
    url: { type: 'string' },
    place: { type: 'string', required: true },
    location: { type: 'json', required: true }
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
    Add.create(inputs).meta({ fetch: true }).exec((err, add) => {
      if (err) return exits.error(err)
      return exits.success(add)
    })

  }

}
