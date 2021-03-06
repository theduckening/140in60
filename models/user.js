var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
      type: String,
      unique: true,
      required: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: {created_at: "created_at"}});

//Occurs each time a User is saved.
UserSchema.pre("save", function(callback){
  var user = this;
  //Exit if password not changed
  if(!user.isModified("password"))
    return callback();
  //New PW, need to hash it.
  bcrypt.genSalt(5, function(err, salt){
    if(err)
      return callback(err);
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err)
        return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, isMatch){
    if(err)
      return callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
