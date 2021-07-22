var M = {
  v: 'v',
  f: function() {
    console.log(this.v);
  }
}

M.f();

module.exports = M;