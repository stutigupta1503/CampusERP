// const mongoose = require('mongoose');
// const timestamps = require('mongoose-timestamps');
// const Schema = mongoose.Schema;

// const facultyTeachingSchema = new Schema({
//     session: { type: String, required:true },
//     facultyName: { type: String, required:true },
//     course: { type: String, required:true },
//     branch: { type: String, required:true },
//     year:{ type: String, enum: ['1', '2', '3', '4'], required: false },
//     semester: { type: String, default: '1', enum: ['1', '2', '3', '4', '5', '6', '7', '8'], required: true },
//     section: { type: String, required:true },
//     subjectCode: { type: String, required:true },
// })    
// facultyTeachingSchema.plugin(timestamps, {index: true})
// module.exports = mongoose.model('facultyTeaching', facultyTeachingSchema)