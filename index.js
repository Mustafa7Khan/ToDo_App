const yargs = require("yargs");
const fs = require("fs");
const { Console } = require("console");

// load existing tasks from tasks.json
const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync('tasks.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// save tasks to tasks.json

const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync('tasks.json', dataJSON);
}; 

// Add a new tasks
const addTask = (title) => {
    const tasks = loadTasks();
    tasks.push({ title, completed: false});
    saveTasks(tasks)
    console.log("New task added");
};

//Remove a task
const removeTask = (title) => {
    let tasks = loadTasks();
    const tasksToKeep = tasks.filter((task) => task.title !== title);
    if (tasks.length > tasksToKeep.length) {
        saveTasks(tasksToKeep);
    } else {
        console.log("task not found");
    }
};

//List all tasks
const listTasks = () => {
    const tasks = loadTasks();
    console.log("Your tasks:");
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} - ${task.completed ? 'Completed' : 'Pending'}`);
        
    });
};

// Mark a task as completed
const completeTask = (title) => {
    const tasks = loadTasks();
    const task = tasks.find( (task) => task.title === title);
    if(task) {
        task.completed =true;
        saveTasks(tasks);
        console.log('Task marked as completed');
    } else {
        console.log('Task not found;');
    }
};

// Define command-line arguments and action 
yargs
    .command({
        command:"add",
        describe: "Add a new task",
        builder: {
            title: {
                describe: "Task title",
                demandOption: true,
                type: "string",
            },
        },
        handler(argv) {
            addTask(argv.title);
        },
    })
    .command({
        command:"remove",
        describe: "Remove a task",
        builder: {
            title: {
            describe: "task title",
            demandOption: true,
            type: "string",
        },
    },
    handler(argv) {
        removeTask(argv.title);
    },
})
.command({
    command: 'list',
    describe: 'List all tasks',
    handler() {
        listTasks();
    },
})
.command({
    command: 'complete',
    describe: 'Mark a task as completed',
    builder: {
        title: {
            describe: 'Task title',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv) {
        completeTask(argv.title);
    },
})
.parse();