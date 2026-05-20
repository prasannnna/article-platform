const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [2, "Minimum 2 letters should be present"],
        maxlength: [50, "Name should not exceed 50 letters"]
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'],
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },
    totalArticles: {
      type: Number,
      default: 0,
    },
    totalVotesReceived: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true
  }
);

// Hashing before saving the user password into DB

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return ;  // next() used for telling mongoose to continue to the next DB operations
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        ;
    }
    catch(error) {
        console.log(`Error! Something went wrong in User creation`, error.message);
        throw error;
    }
});

userSchema.methods.comparePassword = async function(sentPassword) {
    return await bcrypt.compare(sentPassword, this.password);
};

userSchema.methods.getUserProfile = function(id) {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        profilePicture: this.profilePicture,
        role: this.role,
        createdAt: this.createdAt,
        bio: this.bio,
        totalVotesReceived: this.totalVotesReceived,
        totalArticles:this.totalArticles
    }
}

module.exports = mongoose.model('User', userSchema);  // Creating and exporting "User" Model