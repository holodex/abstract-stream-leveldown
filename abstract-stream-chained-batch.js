var inherits = require('inherits')
var assign = require('object-assign')

var AbstractChainedBatch = require('abstract-leveldown/abstract-chained-batch')

function AbstractStreamChainedBatch (stream) {
  this._stream = stream
  this._error = null

  this._stream.on('error', function (err) { this._error = err }.bind(this))
}

inherits(AbstractStreamChainedBatch, AbstractChainedBatch)

assign(AbstractStreamChainedBatch.prototype, {
  _put: function _put (key, value, options) {
    this._stream.write({ key, value })
  },

  _del: function _del (key, options) {
    this._put(key, undefined, options)
  },

  _clear: function _clear () {
    throw new Error('Not supported.')
  },

  _write: function _write (cb) {
    this._stream.end(function () { cb(this._error) }.bind(this))
  }
})

module.exports = AbstractStreamChainedBatch
