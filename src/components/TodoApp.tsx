import React from 'react';
import '../TodoApp.css';

class TodoApp extends React.Component {
  render() {
    return (
      <div className="todo-app">
        <div className="header">
          <h1>
            <span className="easy">Easy</span>
            <span className="todo">ToDo</span>
          </h1>
        </div>
       
      </div>
    );
  }
}

export default TodoApp;
