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
import { FaCheck, FaPencilAlt, FaTrash } from 'react-icons/fa';

const TodoApp: React.FC = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{ taskId: string; taskDescription: string; completed: boolean }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const addTask = () => {
    if (task) {
      const newTask = { taskId: `task-${nextId}`, taskDescription: task, completed: false };

      
      fetch('http://localhost:8080/api/v1/task/saveTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      .then(response => response.json())
      .then(data => {
      
        setTasks([...tasks, data]);
        setNextId(nextId + 1);
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

  const startEditing = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditText('');
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const updatedTask = { taskDescription: editText.trim() };

      fetch(`http://localhost:8080/api/v1/task/updateTask/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        // return response.json();
        return response.text();
      })
      .then(() => {
        setTasks(tasks.map(t => t.taskId === editingTaskId ? { ...t, taskDescription: editText.trim() } : t));
        setEditingTaskId(null);
        setEditText('');
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
    }
  };

  const deleteTask = (taskId: string) => {
    fetch(`http://localhost:8080/api/v1/task/deleteTask/${taskId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter(t => t.taskId !== taskId));
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
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
          {tasks.map(t => (
            <div key={t.taskId} className="task-item">
              {editingTaskId === t.taskId ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                    placeholder="Edit task"
                  />
                  <button onClick={saveEdit} className="saveButton">Save</button>
                  <button onClick={cancelEditing} className="cancelButton">Cancel</button>
                </div>
              ) : (
                <>
                  <span
                    className={`task-text ${t.completed ? 'completed' : ''}`}
                    onClick={() => toggleCompletion(t.taskId)}
                  >
                    {t.taskDescription}
                  </span>
                  <div className="task-actions">
                    <FaPencilAlt onClick={() => startEditing(t.taskId, t.taskDescription)} />
                    <FaTrash onClick={() => deleteTask(t.taskId)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;









// import React, { useState } from 'react';
// import '../TodoApp.css';
// import { FaPencilAlt, FaTrash } from 'react-icons/fa';

// const TodoApp: React.FC = () => {
//   const [task, setTask] = useState('');
//   const [tasks, setTasks] = useState<{ taskId: string; taskDescription: string; completed: boolean }[]>([]);
//   const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
//   const [editText, setEditText] = useState<string>('');


//   const addTask = () => {
//     if (task) {
//       const newTask = { taskDescription: task, completed: false };

//       // Send the new task to the backend
//       fetch('http://localhost:8080/api/v1/task/saveTask', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newTask),
//       })
//       .then(response => response.json())
//       .then(data => {
//         // Add the task to the state after successful API call
//         setTasks([...tasks, { ...data, completed: false }]);
//         setTask('');
//       })
//       .catch(error => {
//         console.error('Error adding task:', error);
//       });
//     }
//   };

//   const toggleCompletion = (taskId: string) => {
//     setTasks(tasks.map(t => t.taskId === taskId ? { ...t, completed: !t.completed } : t));
//   };

// //   const editTask = (taskId: string, newText: string) => {
// //     setTasks(tasks.map(t => t.taskId === taskId ? { ...t, taskDescription: newText } : t));
// //   };


// const startEditing = (taskId: string, currentText: string) => {
//     setEditingTaskId(taskId);
//     setEditText(currentText);
//   };
  
//   const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setEditText(e.target.value);
//   };
  
//   const cancelEditing = () => {
//     setEditingTaskId(null);
//     setEditText('');
//   };
  
//   const saveEdit = () => {
//     if (editText.trim()) {
//       editTask(editingTaskId!, editText.trim());
//       setEditingTaskId(null);
//       setEditText('');
//     }
//   };
  



// const editTask = (taskId: string, newText: string) => {
//     const updatedTask = { taskDescription: newText };
  
//     // Send the updated task to the backend
//     fetch(`http://localhost:8080/api/v1/task/updateTask/${taskId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedTask),
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to update task');
//       }
//       return response.json();
//     })
//     .then(() => {
//       // Update the task in the state after successful API call
//       setTasks(tasks.map(t => t.taskId === taskId ? { ...t, taskDescription: newText } : t));
//     })
//     .catch(error => {
//       console.error('Error updating task:', error);
//     });
//   };
  
  
  

//   const deleteTask = (taskId: string) => {
//     setTasks(tasks.filter(t => t.taskId !== taskId));
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
//           {tasks.map((t) => (
//             <div key={t.taskId} className="task-item">
//               <span
//                 className={`task-text ${t.completed ? 'completed' : ''}`}
//                 onClick={() => toggleCompletion(t.taskId)}
//               >
//                 {t.taskDescription}
//               </span>
//               <div className="task-actions">
//                 <FaPencilAlt onClick={() => editTask(t.taskId, prompt('Edit task:', t.taskDescription) || t.taskDescription)} />
//                 <FaTrash onClick={() => deleteTask(t.taskId)} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TodoApp;












































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



