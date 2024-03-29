const router=require('express').Router()
const TaskController=require("../controllers/taskController")
const subTaskController=require("../controllers/subtaskController")

router.post('/store',TaskController.insertNewTask)

router.get('/tasks',TaskController.showAll)

router.get('/show/:id',TaskController.showByID)

router.put('/update/:id',TaskController.updateByID)

router.delete('/delete/:id',TaskController.deleteByID)

router.put('/cancelTask/:id',TaskController.cancelTask) //cancel task

router.put('/checkAllTasks/:taskid',TaskController.checktask) //complete task and all its subtasks

router.get('/currentDayCompletion',TaskController.calcCurrentDayCompletion)

// router.get('/completionPerDay/',TaskController.calculateCompletionPercentagePerDay)


module.exports=router