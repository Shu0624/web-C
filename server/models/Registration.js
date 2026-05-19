import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  // Team leader info
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 100,
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    maxlength: 30,
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true,
    maxlength: 60,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
  },
  // Which event they're registering for
  event: {
    type: String,
    required: [true, 'Event selection is required'],
    enum: ['Online Coding Platform', 'Blind Coding', 'Startup Pitch', 'E-Sports'],
  },
}, {
  timestamps: true, // adds createdAt & updatedAt
});

// Prevent duplicate registration: same rollNo + same event
registrationSchema.index({ rollNo: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
