const router=require('express').Router()
const subTaskController=require("../controllers/subtaskController")

router.post('/insert/:id',subTaskController.insertNewSubTask) //add subtask 
router.put('/update/:taskid/:subtaskid',subTaskController.updateSubTaskByID) //update subtask
router.delete('/delete/:taskid/:subtaskid',subTaskController.deleteSubTaskByID) //delete subtask
router.put('/completedTask/:taskid',subTaskController.checksubTasktocomletedtask)//complete task by check completed subtasl
router.put('/checkSubTask/:taskid/:subtaskid',subTaskController.checkSubTask) //complete subtask
router.put('/cancel/:taskid/:subtaskid',subTaskController.subtaskCancel) //cancel subtask

module.exports=router