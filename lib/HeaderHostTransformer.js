var stream = require('stream');
var inherits = require('util').inherits;

var Transform = stream.Transform;

var HeaderHostTransformer = function(opts) {
    if (!(this instanceof HeaderHostTransformer)) {
        return new HeaderHostTransformer(opts);
    }

    opts = opts || {}
    Transform.call(this, opts);

    var self = this;
    self.host = opts.host || 'localhost';
    self.replaced = false;
}

inherits(HeaderHostTransformer, Transform);

HeaderHostTransformer.prototype._transform = function (chunk, enc, cb) {
    var self = this;
    chunk = chunk.toString();

    // after replacing the first instance of the Host header
    // we just become a regular passthrough
    if (!self.replaced) {
        self.push(chunk.replace(/(\r\nHost: )\S+/, function(match, $1) {
            self.replaced = true;
            return $1 + self.host;
        }));
    }
    else {
        self.push(chunk);
    }

    cb();
};

module.exports = HeaderHostTransformer;
