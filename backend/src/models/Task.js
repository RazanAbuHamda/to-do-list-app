const mongoose = require("mongoose");

const subtaskSchema = mongoose.Schema({

  description: {
    type: String,
    required: true,
  },

  date : {
    type : Date ,
    default : new Date()
    
  },
  
  status: {
    type: Number,
    validate: {
      validator: function (v) {
        return v == 0 || v == 1 || v == -1; //0 active 1 completed //-1 canceled
      },
      message: 'Value must be either 0 or 1 or -1'
    },
    default: 0
  }


})

const TaskSchema = mongoose.Schema(
  {

    description: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    completionPercentage: {
      type: Number,
      default: 0
    },
    completionDate: { type: Date, default: null },
    subtasks: [subtaskSchema],

    softdelete: {
      type: Date,
      default: null
    },

  },
  {
    timestamps: true,
  },


);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;



  // completed: {
  //   type: Number,
  //   validate: {
  //     validator: function (v) {
  //       return v == 0 || v == 1;
  //     },
  //     message: 'Value must be either 0 or 1'
  //   },
  //   default: 0
  // },


  // editMode : {
  //   type : Boolean,
  //   default : false
  // },

  // completionDate: { type: Date, default: null },

  // softdelete: {
  //   type: Date,
  //   default: null
  // },
