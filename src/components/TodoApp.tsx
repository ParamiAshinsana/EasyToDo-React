// import React, { useState } from 'react';
// import '../TodoApp.css';
// import { FaCheck, FaPencilAlt, FaTrash } from 'react-icons/fa';

// const TodoApp: React.FC = () => {
//   const [task, setTask] = useState('');
//   const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
//   const [nextId, setNextId] = useState(1);

//   const addTask = () => {
//     if (task) {
//       setTasks([...tasks, { id: nextId, text: task, completed: false }]);
//       setNextId(nextId + 1);
//       setTask('');
//     }
//   };

//   const toggleCompletion = (id: number) => {
//     setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
//   };

//   const editTask = (id: number, newText: string) => {
//     setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
//   };

//   const deleteTask = (id: number) => {
//     setTasks(tasks.filter(t => t.id !== id));
//   };

//   return (
//     <div className="todo-app">
//       <div className="header">
//         <h1>
//           <span className="easy">Easy</span>
//           <span className="todo">ToDo</span>
//         </h1>
//       </div>
      
//       <div className="todo-box">
//         <div className="input-container">
//           <input
//             type="text"
//             value={task}
//             onChange={(e) => setTask(e.target.value)}
//             placeholder="Add a new task"
//           />
//           <button className="addButton" onClick={addTask}>Add</button>
//         </div>
//         <div className="task-list">
//           {tasks.map(t => (
//             <div key={t.id} className="task-item">
//               <span
//                 className={`task-text ${t.completed ? 'completed' : ''}`}
//                 onClick={() => toggleCompletion(t.id)}
//               >
//                 {t.text}
//               </span>
//               <div className="task-actions">
//                 <FaPencilAlt onClick={() => editTask(t.id, prompt('Edit task:', t.text) || t.text)} />
//                 <FaTrash onClick={() => deleteTask(t.id)} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;














import React, { useState } from 'react';
import '../TodoApp.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const TodoApp: React.FC = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{ taskId: string; taskDescription: string; completed: boolean }[]>([]);

  const addTask = () => {
    if (task) {
      const newTask = { taskDescription: task, completed: false };

      // Send the new task to the backend
      fetch('http://localhost:8080/api/v1/task/saveTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      .then(response => response.json())
      .then(data => {
        // Add the task to the state after successful API call
        setTasks([...tasks, { ...data, completed: false }]);
        setTask('');
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
    }
  };

  const toggleCompletion = (taskId: string) => {
    setTasks(tasks.map(t => t.taskId === taskId ? { ...t, completed: !t.completed } : t));
  };

  const editTask = (taskId: string, newText: string) => {
    setTasks(tasks.map(t => t.taskId === taskId ? { ...t, taskDescription: newText } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.taskId !== taskId));
  };

  return (
    <div className="todo-app">
      <div className="header">
        <h1>
          <span className="easy">Easy</span>
          <span className="todo">ToDo</span>
        </h1>
      </div>
      
      <div className="todo-box">
        <div className="input-container">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
          />
          <button className="addButton" onClick={addTask}>Add</button>
        </div>
        <div className="task-list">
          {tasks.map((t) => (
            <div key={t.taskId} className="task-item">
              <span
                className={`task-text ${t.completed ? 'completed' : ''}`}
                onClick={() => toggleCompletion(t.taskId)}
              >
                {t.taskDescription}
              </span>
              <div className="task-actions">
                <FaPencilAlt onClick={() => editTask(t.taskId, prompt('Edit task:', t.taskDescription) || t.taskDescription)} />
                <FaTrash onClick={() => deleteTask(t.taskId)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;












































// import React from 'react';
// import '../TodoApp.css';

// class TodoApp extends React.Component {
//   render() {
//     return (
//       <div className="todo-app">
//         <div className="header">
//           <h1>
//             <span className="easy">Easy</span>
//             <span className="todo">ToDo</span>
//           </h1>
//         </div>
       
//       </div>
//     );
//   }
// }

// export default TodoApp;



