import React, {
  useState,
  useEffect
} from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


const socket = io('localhost:8000');


function App() {

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');


  useEffect(() => {
    socket.on('addTask', ({name, id}) => addTask(name, id));
    socket.on('removeTask', ({id, isLocal}) => removeTask(id, isLocal));
    socket.on('updateData', (data) => updateTask(data));
  });

  const removeTask = (id, isLocal) => {
    setTasks(tasks.filter(item => item.id != id));

    if(isLocal) {
      socket.emit('removeTask', id);
    };
  };

  const updateTask = (serverData) => {
    setTasks([...tasks, ...serverData]);
  };


  const submitForm = (event) => {
    event.preventDefault();

    const id = uuidv4();

    if (taskName) {
      addTask(taskName, id);
      socket.emit('addTask', {
        name: taskName,
        id,
      });
    } else {
      alert('Make sure you have write your task');
    };

    event.target.reset();
    setTaskName('');
  };

  const addTask = (task, id) => {
    setTasks([...tasks, {id, name: task}]);
  }
  console.log(tasks);

  return (
    <div className="App">
    <header>
      <h1>ToDoList.app</h1>
    </header>
    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>
      <ul className="tasks-section__list" id="tasks-list">
        {tasks.map(item => <li className="task" key={item.id}>{item.name}<button className="btn btn--red" onClick={()=> removeTask(item.id, true)}>Remove</button></li>)}
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