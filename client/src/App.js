import React, {
  useState,
  useEffect
} from 'react';
import io from 'socket.io-client';


const socket = io('localhost:8000');

function App() {

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');


  useEffect(() => {

    socket.on('addTask', ({
      task,
    }) => addTask(task));

    socket.on('removeTask', ({
      id,
    }) => removeTask(id));

    socket.on('updateData', (data) => updateTask(data));
  }, );

  const removeTask = (id) => {
    const removedTask = tasks[id];
    setTasks(tasks.filter(item => item != removedTask));

    socket.emit('removeTask', {
      id: id,
    });
  };

  const updateTask = (serverData) => {
    setTasks([...tasks, ...serverData.tasks]);
  }


  const submitForm = (event) => {
    event.preventDefault();

    if (taskName) {
      addTask(taskName);
      socket.emit('addTask', {
        task: taskName,
      });
    } else {
      alert('Make sure you have write your task');
    };

    event.target.reset();
    setTaskName('');
  };

  const addTask = (task) => {
    const index = tasks.findIndex(item => item == task);
    if (index == -1) {
      setTasks([...tasks, task]);
    } else {
      alert('You have already added this task')
    }
  }

  return (
    <div className="App">
    <header>
      <h1>ToDoList.app</h1>
    </header>
    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>
      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(item => <li className="task" key={tasks.findIndex(task => task == item)}>{item}<button className="btn btn--red" onClick={()=> removeTask(tasks.findIndex(task => task == item))}>Remove</button></li>)}
      </ul>
      <form id="add-task-form" onSubmit={submitForm}>
        <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" onChange={event => setTaskName(event.target.value)}/>
        <button className="btn" type="submit">Add</button>
      </form>
    </section>
  </div>
  );
}

export default App;