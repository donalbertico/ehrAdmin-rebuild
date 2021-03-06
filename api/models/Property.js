/* globals Property */
require('date-utils')
var shortid = require('shortid')
var gmApi = require('@google/maps').createClient(sails.config.custom.googlemaps_geocoding)
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')
/**
 * Property.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var validations = {
  service: function (services) {
    var s
    for (var i in services) {
      s = services[i]
      if (s !== 'i' && s !== 'w' && s !== 'e' && s !== 't' && s !== 'c' && s !== 'gk' && s !== 'hk' && s !== 'ne' && s !== 'pv' && s !== 'ni' && s !== 'gu' && s !== 'ma') {
        return false
      }
    }
    return true
  },
  additionalService: function (services) {
    var s
    for (var i in services) {
      s = services[i]
      if (s !== 'p' && s !== 'j' && s !== 'g' && s !== 'sf' && s !== 'l' && s !== 'h' && s !== 'ac' && s !== 'ca' && s !== 'el' && s !== 'b' && s !== 'r' && s !== 'gr' && s !== 'cga' && s !== 'cpg' && s !== 'bbq' && s !== 'sau' && s !== 'tbt' && s !== 'vpa') {
        return false
      }
    }
    return true
  },
  artifacts: function (artif) {
    var s
    for (var i in artif) {
      s = artif[i]
      if (s !== 'aw' && s !== 'ar' && s !== 'ad' && s !== 'adw' && s !== 'ak' && s !== 'awh' && s !== 'atv' && s !== 'amw') {
        return false
      }
    }
    return true
  },
  includedService: function (services) {
    var s
    for (var i in services) {
      s = services[i]
      if (s !== 'ii' && s !== 'iw' && s !== 'ie' && s !== 'it' && s !== 'igk' && s !== 'ic' && s !== 'ihk' && s !== 'ine') {
        return false
      }
    }
    return true
  },
  photos: function (photos) {
    return photos.length <= 20 && photos[0] !== null
  },
  location: function (loc) {
    if (loc.coordinates) {
      if (typeof loc.coordinates[0] === 'number' && typeof loc.coordinates[1] === 'number') {
        return true
      }
    }
    return false
  },
  floorType: function (floors) {
    var s
    for (var i in floors) {
      s = floors[i]
      if (s !== 'ft' && s !== 'fc' && s !== 'fo' && s !== 'fw') {
        return false
      }
    }
    return true
  }
}
module.exports = {
  schema: true,
  attributes: {
    // basic info
    owner: { model: 'User', required: true },
    state: { type: 'string', isIn: ['e', 'v', 'n', 'p'], defaultsTo: 'n' },
    type: {
      type: 'string',
      isIn: ['rro', 'rsr', 'hih', 'hth', 'dde', 'ddu', 'dpe', 'dsu', 'dlo', 'lfa', 'lla', 'cof', 'cse', 'cst', 'cga', 'cba', 'tsm', 'tdb', 'ths', 'tma'],
      required: true
    },
    title: { type: 'string', maxLength: 50, required: true },
    // start of fields required to publish
    // location related
    city: { type: 'string', defaultsTo: '' },
    address: { type: 'string', maxLength: 200, defaultsTo: '' },
    locality: { type: 'string', maxLength: 100, defaultsTo: '' },
    location: { type: 'json', defaultsTo: { type: 'Point', coordinates: [-78.455874, -0.002269] } },
    postalCode: { type: 'string', allowNull: true },
    // descriptions
    description: { type: 'string', maxLength: 1020 },
    zoneDescription: { type: 'string', maxLength: 5020 },
    // price related
    payment: { type: 'number', min: 0 },
    deposit: { type: 'number', min: 0 },
    paymentPeriod: { type: 'string', isIn: ['w', 'm', 'd'], defaultsTo: 'm' },
    negotiable: { type: 'boolean', defaultsTo: false },
    area: { type: 'number', min: 0, allowNull: true },
    totalArea: { type: 'number', min: 0, allowNull: true },
    // end of fields required to publish
    // additional info
    housingComplex: { type: 'boolean', defaultsTo: false },
    furnished: { type: 'string', isIn: ['f', 's', 'n'], allowNull: true },
    // services and artifacts
    services: { type: 'json', defaultsTo: [], custom: validations.service },
    includedServices: { type: 'json', defaultsTo: [], custom: validations.includedService },
    additionalServices: { type: 'json', defaultsTo: [], custom: validations.additionalService },
    artifacts: { type: 'json', defaultsTo: [], custom: validations.artifacts },
    garageCapacity: { type: 'number', min: 0, defaultsTo: 0 },
    storage: { type: 'number', min: 0, defaultsTo: 0 },
    rooms: { type: 'number', min: 0, defaultsTo: 0 },
    baths: { type: 'number', min: 0, defaultsTo: 0 },
    beds: { type: 'number', min: 0, defaultsTo: 0 },
    pets: { type: 'boolean', defaultsTo: false },
    aliquotIncluded: { type: 'boolean', defaultsTo: false },
    floor: { type: 'number', min: -1, allowNull: true },
    floorNumber: { type: 'number', min: 0, defaultsTo: 0 },
    buildState: { type: 'string', isIn: ['n', 'u', 'r'], allowNull: true },
    peopleCapacity: { type: 'number', min: 0, defaultsTo: 0 },
    floorType: { type: 'json', custom: validations.floorType, defaultsTo: [] },
    neighborhoodType: { type: 'string', isIn: ['c', 'r', 'a', 'fd', 'cd', 't', 'd', 'ru'], allowNull: true },
    constructedYear: { type: 'number', min: 1600, allowNull: true },
    photos: { type: 'json', custom: validations.photos, defaultsTo: [] },
    video: { type: 'string', defaultsTo: '' },
    // discount
    discount: { type: 'number', min: 0, max: 100, defaultsTo: 0 },
    minDiscountPeriod: { type: 'number', min: 0, max: 36, defaultsTo: 0 },
    // misc
    shared: { type: 'boolean', defaultsTo: false },
    pdA: { type: 'number', allowNull: true },
    pdB: { type: 'number', allowNull: true },
    promotedUntil: { type: 'number', defaultsTo: 0 },
    publishedDates: { type: 'json', defaultsTo: [] },
    lastPublishedDate: { type: 'number', allowNull: true },
    shortId: { type: 'string' },
    reference: { type: 'string' }
  },
  customToJSON: function () {
    return {
      ...this,
      location: {
        latitude: this.location.coordinates[1],
        longitude: this.location.coordinates[0]
      }
    }
  },
  changeState: function (opts, cb) {
    ((afterLookUp) => {
      if (typeof opts.prop === 'object') { return afterLookUp(null, opts.prop) }
      Property.findOne(opts.prop).exec(afterLookUp)
    })(function (err, prop) {
      if (err) { return cb(err) }
      if (!prop) {
        return cb({ message: 'prop_not_found' })
      }
      switch (opts.state) {
        case 'v':
          var newDates = [Date.today().getTime(), ...prop.publishedDates]
          Property.update(prop.id, { publishedDates: newDates, state: 'v' }, (err) => {
            if (err) { return cb(err) }
            cb(null, newDates)
          })
          break
        case 'p':
          Property.update(prop.id, { state: 'p' }, (err) => {
            if (err) { return cb(err) }
            cb()
          })
          break
        case 'e':
          Property.update(prop.id, { state: 'e' }, (err) => {
            if (err) { return cb(err) }
            cb()
          })
          break
        case 'n':
          Property.update(prop.id, { state: 'n' }, (err) => {
            if (err) { return cb(err) }
            cb()
          })
          break
        default:
          return cb({ message: 'invalid_state' })
      }
    })
  },
  isPromoted: function (prop) {
    if (prop.promotedUntil) {
      var promotedUntil = new Date(prop.promotedUntil)
      return Date.compare(promotedUntil, Date.today()) > 0
    } else {
      return false
    }
  },
  getPromotedDays: function (promoDate) {
    if (typeof promoDate !== 'object') {
      promoDate = new Date(promoDate)
    }
  },
  hasExpired: function (lastPublishedDate) {
    if (typeof lastPublishedDate !== 'object') {
      lastPublishedDate = new Date(lastPublishedDate)
    }
    var days = Date.today().getDaysBetween(lastPublishedDate)
    if (Math.abs(days) >= 180) {
      return true
    } else {
      return false
    }
  },
  isAboutToExpire: function (lastPublishedDate) {
    if (typeof lastPublishedDate !== 'object') {
      lastPublishedDate = new Date(lastPublishedDate)
    }
    lastPublishedDate = lastPublishedDate.add({ days: 172 })
    return Date.equalsDay(lastPublishedDate, Date.today())
  },
  beforeCreate: function (prop, next) {
    prop.shortId = shortid.generate()
    if (prop.location) {
      prop.location = {
        type: 'Point',
        coordinates: [prop.location.longitude, prop.location.latitude]
      }
    }
    console.log(prop)
    next(null, prop)
  },
  beforeUpdate: function (values, next) {
    if (values.publishedDates) {
      values.lastPublishedDate = values.publishedDates[0]
    }
    if (values.location) {
      values.location = {
        type: 'Point',
        coordinates: [values.location.longitude, values.location.latitude]
      }
    }
    next(null, values)
  },
  reverseGeocode: function (inputs, exits) {
    // Request the reverse geocoding with lat and lng
    gmApi.reverseGeocode({ latlng: { lat: inputs.latitude, lng: inputs.longitude } }, (err, response) => {
      if (err) {
        console.log(err.message)
        return exits.error(err)
      }
      var places = response.json.results
      // Choose the first result and look for a postal code inside
      var found = false
      var pc
      places.forEach((place) => {
        place.address_components.forEach((comp) => {
          if (comp.types[0] === 'postal_code') {
            found = true
            if (!pc) {
              pc = comp.long_name
            }
          }
        })
      })
      if (found) {
        return exits.success(pc)
      } else {
        // if no postal code was found then just return not found
        return exits.notFound()
      }
    })
  }

}
