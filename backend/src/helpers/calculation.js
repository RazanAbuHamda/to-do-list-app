const Task = require("../models/Task")

module.exports.overallCompletionPercentage = (tasks) => {

    var count = 0;

    const sumCompletionPercentages = tasks.reduce((sum, task) => {
        if (task.softdelete == null) { 
            count++;
            console.log(count)
            return sum + task.completionPercentage }
        else
            return sum + 0
    }, 0);
    // calculate the total weight (i.e., sum of all completion percentages)
    const overallCompletionPercentage = (sumCompletionPercentages / (count * 100)) * 100;

    return overallCompletionPercentage;

}


module.exports.calculateTaskCompletionPercentage =  (task)  => {

    const subtasks = task.subtasks;
    const totalSubtasks = subtasks.length;

    // if (totalSubtasks === 0) {
    //     return task.completionPercentage ? 100 : 0;
    // }

    const completedSubtasks = subtasks.filter(subtask => subtask.status==1);
    const completedSubtasksCount = completedSubtasks.length;

    const subtasksCompletionPercentage = completedSubtasksCount / totalSubtasks;

    const x = Math.round(subtasksCompletionPercentage * 100)

    // task.completionPercentage = x;
    // await task.save();

    // res.status(200).json({ CompletionPercentage: Math.round(subtasksCompletionPercentage * 100) })

    return x
        // const subtasks = task.subtasks;
        // const totalSubtasks = subtasks.length;

        // const completedSubtasks =  subtasks.filter(subtask => subtask.status == 1);
        // const completedSubtasksCount = completedSubtasks.length;

        // const canceledSubtasks =  subtasks.filter(subtask => subtask.status == -1);
        // const canceledSubtasksCount = canceledSubtasks.length;

        // const subtasksCompletionPercentage = completedSubtasksCount / (totalSubtasks-canceledSubtasksCount);

        // const x = Math.round(subtasksCompletionPercentage * 100)

        // return x

}