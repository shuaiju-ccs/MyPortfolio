import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
  firstname: { type: String, trim: true, required: 'First name is required' },
  lastname: { type: String, trim: true, required: 'Last name is required' },
  email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
     },
     phone: { type: String, trim: true },
     message: { type: String, trim: true },
     preferredContactMethod: { type: String, enum: ['email', 'phone', 'either'], default: 'email' },
     referralSource: { type: String, trim: true },
     subscribeToUpdates: { type: Boolean, default: false },
     created: { type: Date, default: Date.now }
   })

export default mongoose.model('Contact', ContactSchema)   // collection: contacts
