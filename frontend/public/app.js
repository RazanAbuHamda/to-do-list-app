<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

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
        addTask: function () {
            this.tasks.push({
                id: this.num,
                words: this.taskText,
                done: this.done,
                cancel: this.cancel,
                date: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
                editMode: this.editMode,
                reminder: new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString('fr-CA'),
            });
            this.taskText = '';
            this.num++;
        },
        deleteTask: function (index) {
            this.tasks.splice(index, 1);
        },
        editTask: function (index) {
            this.tasks[index].editMode = true;
        },
        saveEditedTask(index) {
            this.tasks[index].words = this.newValue;
            this.tasks[index].editMode = false;
        },
        checkCompletedTask(index) {
            isChecked = !this.tasks[index].done;
            if (isChecked) {
                this.completedTasks.push(this.tasks[index]);
            } else {
                this.completedTasks.splice(this.tasks[index], 1);
            }
        },
        updateTasks() {
            this.tasks = this.filteredTasks();
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