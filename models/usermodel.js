const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        unique : true
        //required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    roles: {
        type: String,
        default: "user",
        enum: ["user", "trainer"]
    },
    isAdmin: {
        type: Boolean,
        default: false,
      },
    activityTrack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    workoutTrack: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Workout",
        },
      ],
    

}, {timestamps : true});


userSchema.pre("save", async function (next) {
    const user = this;
  
    if (!user.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
  
    next();
  });
  
  userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };


const Users = mongoose.model("Users", userSchema);


module.exports = Users;