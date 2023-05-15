<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
import axios from 'axios';
var vm = new Vue({
    el: "#to-do-list",
    data: {
        tasks: [],
        choosenArray: [],
        selectedFilter: 1, // set the default selected option to "All"
        completedTasks: [],
        canceledTasks: [],
        taskText: '',
        newValue: '',
        num: 1,
        editMode: false,
        done: false,
        cancel: false,
        percentageNum: 0,
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
        },async fetchTasks() {
            try {
                const response = await axios.get('/api/tasks');
                this.tasks = response.data.tasks;
                this.updateTasks();
            } catch (error) {
                console.error(error);
            }
        },
        deleteTask(index) {
            const taskId = this.tasks[index]._id;
            axios.delete(`/api/delete/${taskId}`)
                .then(() => {
                    this.tasks.splice(index, 1);
                    this.updateTasks();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        editTask: function (index) {
            this.tasks[index].editMode = true;
        },
        saveEditedTask(index) {
            this.tasks[index].words = this.newValue;
            this.tasks[index].editMode = false;

            const taskId = this.tasks[index]._id;
            axios.put(`/api/update/${taskId}`, { words: this.newValue })
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

            axios.put(`/api/tasks/${taskId}`, { done: isChecked })
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
        updateTasks() {
            switch (this.selectedFilter) {
                case "1":
                    this.filteredTasks = this.tasks;
                    break;
                case "2":
                    this.filteredTasks = this.completedTasks;
                    break;
                case "3":
                    this.filteredTasks = this.tasks.filter(task => !task.done);
                    break;
                case "4":
                    this.filteredTasks = this.canceledTasks;
                    break;
                default:
                    this.filteredTasks = this.tasks;
                    break;
            }
        },

    },
    computed: {
        filterTasks: function () {
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
        },
        updateTasks() {
            this.tasks = this.filteredTasks();
        },
        completionPercentage() {
            const total = this.tasks.length;
            var completed = 0;
            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].done) {
                    completed++;
                }
            }
            if (total === 0) {
                return 0;
            } else {
                return Math.round((completed / total) * 100);
            }
        },
        completionInCurrentDayPercentage() {
            const today = new Date();
            let totalTasksInDay = 0;
            let completedTasks = 0;

            for (let i = 0; i < this.tasks.length; i++) {
                const taskDate = new Date(this.tasks[i].date);
                if (taskDate.getDate() === today.getDate() && taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()) {
                    totalTasksInDay++;
                    if (this.tasks[i].done) {
                        completedTasks++;
                    }
                }
            }

            if (totalTasksInDay === 0) {
                return 0;
            }

            return Math.round((completedTasks / totalTasksInDay) * 100);
        }
        ,
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
        //هاي عملتها عشان كل دقيقة تستدعي الميثود الي بتفحص هل مر يوم كامل على المهمة عشان ألغيها ؟
        setInterval(this.isPastDue, 60000); // call getCurrentTime every minute
        $('.task-list').sortable();

    },
})