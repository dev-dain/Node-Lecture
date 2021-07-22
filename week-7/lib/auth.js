module.exports = {
  auth: function (req, res) {
    let authLogin = (req.user) ? 
    `${req.user.nickname} | <a href="/logout">logout</a>` : '<a href="/auth/login">login</a>';
    return authLogin;
  }
}