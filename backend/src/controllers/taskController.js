const Task = require("../models").Task
const { overallCompletionPercentage } = require("../helpers/calculation");
const { json } = require("express");

module.exports.insertNewTask = async (req, res) => {
    try {
        req.body.user_id = req.user._id;
        const task = await Task.create(req.body)
        res.status(200).json({ message: "task added successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

module.exports.showAll = async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.user._id })
        if (tasks.length == 0)
            x = 0;
        x = overallCompletionPercentage(tasks)
        res.status(200).json({ "tasks": tasks, "OverallCompletionPercentage": x })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.showByID = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id)
        res.status(200).json(task)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

module.exports.updateByID = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findByIdAndUpdate(id, req.body)
        if (!task) {
            res.status(404).json({ message: `${id} not found` })
        }
        const updatedTask = await Task.findById(id)
        res.status(200).json(updatedTask)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

module.exports.deleteByID = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findByIdAndDelete(id, req.body)
        if (!task) {
            res.status(404).json({ message: `${id} not found` })
        }
        res.status(200).json(task)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

module.exports.cancelTask = async (req, res) => {

    try {
        const { id } = req.params
        const task = await Task.findById(id)
        task.softdelete = Date.now()
        task.save()
        res.status(200).json(task)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }

}

//completion percentage added 
module.exports.checktask = async (req, res) => {

    try {

        const { taskid } = req.params
        const task = await Task.findById(taskid)

        if (req.body.checkbox)
            completeAll(task)
        else
            uncomletedAll(task)

        task.save()
        res.status(200).json(task)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

uncomletedAll = (task) => {
    task.softdelete = null;
    if (task.subtasks.length > 0) {
        //update every subtask of subtasks
        const subtaskUpdates = task.subtasks

        const subtasksfilter = subtaskUpdates.filter(obj => obj.status == 1);

        subtasksfilter.forEach(e => e.status = 0)

    }
    task.completionPercentage = 0
    task.completionDate = null;

}

completeAll = (task) => {
    task.softdelete = null;
    if (task.subtasks.length > 0) {

        const subtaskUpdates = task.subtasks

        const subtasksfilter = subtaskUpdates.filter(obj => obj.status == 0);

        subtasksfilter.forEach(e => e.status = 1)
    }
    task.completionPercentage = 100
    task.completionDate = Date.now();
}

module.exports.calcCurrentDayCompletion = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Set the time to the beginning of the next day

        const tasks = await Task.find({
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        })

        length = tasks.length

        count = 0;

        if (tasks.length == 0)
            res.status(200).json({ "message": "0 tasks" })

        const x = tasks.reduce((acc, task) => {

            if (task.softdelete == null) {
                count++;
                console.log(count, 'hhhhhhhhh');
                return acc + task.completionPercentage
            }

            return acc + 0;

        },

            0

        );

        console.log(x, 'ggggggggg')
        const y = x / count;

        res.status(200).json({ "currentDay": y })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }

}


// module.exports.calculateCompletionPercentagePerDay = async (req, res) => {
//     try {
//         // Group the tasks by date
//         const tasks = await Task.find({ user_id: req.user._id })

//         length = tasks.length

//         tasksByDate = tasks.flatMap(item => {
//             if (item.subtasks.length == 0 & item.completionPercentage == 100)
//                 return [{
//                     "description": item.description,
//                     "_id": item._id,
//                     "completionDate": item.completionDate,
//                     "completed": 1
//                 }]

//             item.subtasks.forEach(element => {

//                 if (element.date)
//                     element.completed = 1 / item.subtasks.length //subtask weight at the level of all tasks
//             });
//             return item.subtasks
//         });

//         tasksByDate = tasksByDate.reduce((acc, task) => {
//             if (task.completionDate == null) return acc;
//             const completionDate = task.completionDate.toISOString();
//             const dateOnly = completionDate.substring(0, completionDate.indexOf('T'));
//             if (!acc[dateOnly]) { //if the date is new add new row to the array
//                 acc[dateOnly] = [];
//             }
//             acc[dateOnly].push(task);
//             return acc;

//         }, {});

//         console.log(tasksByDate)

//         //   Calculate the average completion rate for each date
//         const averageCompletionRatesPerDay = Object.entries(tasksByDate).map(([date, tasks]) => {
//             const totalCompletionRate = tasks.reduce((acc, task) => acc + task.completed, 0);
//             const averageCompletionRate = (totalCompletionRate) / length * 100;
//             return { date, averageCompletionRate };
//         });

//         res.status(200).json({ "averageCompletionRatesPerDay": averageCompletionRatesPerDay })
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json({ message: error.message })
//     }
// }

