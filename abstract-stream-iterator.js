var inherits = require('inherits')
var assign = require('object-assign')
var AbstractIterator = require('abstract-leveldown/abstract-iterator')

  
function AbstractStreamIterator (stream) {
  this._stream = stream
  this._hasEnded = false
  this._error = null

  this._stream.on('end', function () {
    this._hasEnded = true
    this._check()
  }.bind(this))

  this._stream.on('error', function (err) {
    this._error = err
    this._check()
  }.bind(this))
}
inherits(AbstractStreamIterator, AbstractIterator)

assign(AbstractStreamIterator.prototype, {
  _next: function _next (cb) {
    this._cb = cb
    this._check()
  },

  _check: function _check () {
    if (this._error) return setImmediate(this._cb, this._error)

    var kv = this._stream.read()

    if (kv !== null) return setImmediate(this._cb, null, kv.key, kv.value)

    if (this._hasEnded) return setImmediate(this._cb)

    this._stream.once('readable', function () { this._check() }.bind(this))
  }
})

module.exports = AbstractStreamIterator
