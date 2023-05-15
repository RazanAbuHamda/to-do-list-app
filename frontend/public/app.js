import axios from 'axios';
import Vue from 'vue';

Vue.create({
    el: "#to-do-list",
    data: {
        tasks: [],
        choosenArray: [],
        selectedFilter: '', //default filter is none
        selectedSorting: '', // default sorting is none
        completedTasks: [],
        canceledTasks: [],
        taskText: '',
        num: 1,
        editMode: false,
        done: false,
        cancel: false,
        percentageNum: 0,
        subTaskId: 1,
        subTaskDone: false,
        subTaskCancel: false,
        subtaskInput: 0

    },
    methods: {
        async addTask() {
            try {
                const response = await axios.post('/api/store', {
                    words: this.taskText,
                    done: false,
                    date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                    editMode: false,
                    reminder: new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString('fr-CA'),
                });
                console.log(response.data);
                this.taskText = '';
                this.fetchTasks();
            } catch (error) {
                console.error(error);
            }
        }, async fetchTasks() {
            try {
                const response = await axios.get('/api/tasks');
                console.log(response)
                this.tasks = response.data.tasks;
                this.updateTasks();
            } catch (error) {
                console.error(error);
            }
        },
        async deleteTask(index) {
            const taskId = this.tasks[index]._id;
            try {
                await axios.delete(`/api/delete/${taskId}`);
                this.tasks.splice(index, 1);
                this.updateTasks();
            } catch (error) {
                console.error(error);
            }
        },

        deleteSubtask: function (parentIndex, childIndex) {
            const parentTask = this.tasks[parentIndex];
            const subtaskId = parentTask.subTasks[childIndex].id;
            try {
                axios.delete(`/api/subtasks/${subtaskId}`)

                parentTask.subTasks.splice(childIndex, 1);
            } catch (error) {
                console.error(error);
            }
        },


        editTask: function (index) {
            this.tasks[index].editMode = true;
        },
        editSubtask: function (parentIndex, childIndex) {
            this.tasks[parentIndex].subTasks[childIndex].subTaskEditMode = true;
        },
        saveEditedSubtask: function (parentIndex, childIndex) {
            this.tasks[parentIndex].subTasks[childIndex].txt = this.tasks[parentIndex].subTasks[childIndex].subTaskEditedValue;
            this.tasks[parentIndex].subTasks[childIndex].subTaskEditMode = false;
        },


        saveEditedTask(index) {
            this.tasks[index].words = this.newValue;
            this.tasks[index].editMode = false;

            const taskId = this.tasks[index]._id;
            axios.put(`/api/update/${taskId}`, {words: this.newValue})
                .then(() => {
                    this.updateTasks();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        checkCompletedTask(index) {
            const taskId = this.tasks[index]._id;
            const isChecked = !this.tasks[index].done;

            axios.put(`/api/tasks/${taskId}`, {done: isChecked})
                .then(() => {
                    if (isChecked) {
                        this.completedTasks.push(this.tasks[index]);
                    } else {
                        const completedIndex = this.completedTasks.findIndex((task) => task._id === taskId);
                        if (completedIndex !== -1) {
                            this.completedTasks.splice(completedIndex, 1);
                        }
                    }
                    this.updateTasks();
                })
                .catch((error) => {
                    console.error(error);
                });
        },


        checkCompletedSubTask(parentIndex, childIndex) {
            var isChecked = !this.tasks[parentIndex].subTasks[childIndex].done;
            if (isChecked) {
                this.completedTasks.push(this.tasks[parentIndex].subTasks[childIndex])
            } else {
                this.completedTasks.splice(this.tasks[parentIndex].subTasks[childIndex], 1)

            }
        },
        updateTasks() {
            this.tasks = this.filteredTasks();
        },
        sortTasks() {
            this.tasks = this.filteredTasks();
        },
        addSubtask: function (index) {
            this.tasks[index].subTasks.push({
                parentId: index,
                id: this.subTaskId,
                txt: this.tasks[index].subTaskTxt,
                date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                done: this.subTaskDone,
                cancel: this.subTaskCancel,
                subTaskEditMode: false,
                subTaskEditedValue: '',

            });
            this.tasks[index].subTaskTxt = '',
                this.subTaskId++;
        },
        sortAccordingToAddedDate() {

            return this.tasks.sort(
                (taskA, taskB) => Number(taskA.date) - Number(taskB.date),
            );
        },
        sortAccordingToCompletedDate() {

            return this.completedTasks.sort(
                (taskA, taskB) => Number(taskA.completionDate) - Number(taskB.completionDate),
            );
        },
    },
    computed: {
        filterTasks: function () {
            if (this.selectedFilter !== '') {
                switch (this.selectedFilter) {
                    case "1":
                        return this.tasks;
                    case "2":
                        return this.completedTasks;
                    case "3":
                        return this.tasks.filter(task => !task.done);
                    case "4":
                        return this.canceledTasks;
                    default:
                        return this.tasks;
                }
            } else {
                switch (this.selectedSorting) {
                    case "1":
                        return this.sortAccordingToAddedDate();
                    case "2":
                        return this.sortAccordingToCompletedDate();
                    default:
                        return this.tasks;
                }
            }

        },
        completionPercentage() {
            var totalTasks = this.tasks.length;
            var totalSubtasks = this.tasks.reduce((acc, task) => acc + task.subTasks.length, 0);
            var completedTasks = 0;
            var completedSubtasks = 0;

            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].done) {
                    completedTasks++;
                    completedSubtasks += this.tasks[i].subTasks.length;
                } else {
                    for (let n = 0; n < this.tasks[i].subTasks.length; n++) {
                        if (this.tasks[i].subTasks[n].subTaskDone) {
                            completedSubtasks++;
                        }
                    }
                }
            }
            var total = totalTasks + totalSubtasks;
            var completed = completedTasks + completedSubtasks;

            if (total === 0) {
                return 0;
            } else {
                return Math.round((completed / total) * 100);
            }
        },
        completionInCurrentDayPercentage() {
            const today = new Date();
            let totalTasksInDay = 0;
            let totalSubtasksInDay = 0;
            let completedTasks = 0;
            let completedSubtasks = 0;

            for (let i = 0; i < this.tasks.length; i++) {
                const taskDate = new Date(this.tasks[i].date);
                if (taskDate.getDate() === today.getDate() && taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()) {
                    totalTasksInDay++;
                    totalSubtasksInDay = this.tasks.reduce((acc, task) => acc + task.subTasks.length, 0);

                    if (this.tasks[i].done) {
                        completedTasks++;
                        completedSubtasks += this.tasks[i].subTasks.length;
                    } else {
                        for (let n = 0; n < this.tasks[i].subTasks.length; n++) {
                            // const subTaskDate = new Date(this.tasks[i].subTasks[n].date);
                            // if (taskDate.getDate() === today.getDate() && taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()) {
                            //     totalSubtasksInDay++;
                            if (this.tasks[i].subTasks[n].subTaskDone) {
                                completedSubtasks++;
                            }
                            // }

                        }
                    }
                }
            }
            console.log("completedSubtasks", completedSubtasks);
            console.log("completedTasks", completedTasks);
            console.log("totalTasksInDay", totalTasksInDay);
            console.log("totalSubtasksInDay", totalSubtasksInDay);

            if (totalTasksInDay === 0) {
                return 0;
            }
            var totalCompleted = completedTasks + completedSubtasks;
            var total = totalSubtasksInDay + totalTasksInDay;
            return Math.round((totalCompleted / total) * 100);
        }
        ,
        methods: {
            isPastDue: function () {
                for (let i = 0; i < this.tasks.length; i++) {
                    if (!this.tasks[i].done && this.tasks[i].reminder - this.tasks[i].date) {
                        this.tasks[i].cancel = !this.tasks[i].cancel;
                        this.canceledTasks.push(this.tasks[i]);
                    } else {
                        this.canceledTasks.splice(this.tasks[i], 1);
                    }
                }
            },
        },
        mounted() {
            // This is to call the method 'isPastDue' every minute to check if a full day has passed since the task was created and cancel it
            setInterval(this.isPastDue, 60000); // Call 'isPastDue' every minute
            ('.task-list').sortable();
        }
    },
}).mount('#to-do-list');
