// validate token;

const User = require('../dbModel/user');
const Admin = require('../dbModel/admin');
const key = require("../secret/jwtkey").KEYORSECRET;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    User.findById(jwt_payload._id).then(user=>{
      if(user){
        return done(null,user);
      }else{
        Admin.findById(jwt_payload._id).then(admin=>{
          if(admin){
            return done(null,admin);
          }else{
            return done(null,false);
          }
        });
      }
    })
  }))
}
