import {useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://todo-api-henna.vercel.app/api/todos';

function App(){
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
  }
  async function addTodo(e){
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-Type': 'application/json'},
      body: JSON.stringify({ title }) 
    });
    setTitle('');
    fetchTodos();
  }
  async function toggleComplete(todo) {
    await fetch(`${API_URL}/${todo._id}`, {
      method: 'PUT',
      headers: { 'content-Type': 'application/json'},
      body: JSON.stringify({ completed: !todo.completed })
    });
    fetchTodos();
  }
  async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
  }
  return (
    <div className='app-container'  >
      <h1 >📝 My Todo App</h1>

      <form onSubmit={addTodo}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              onClick={() => toggleComplete(todo)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {todo.title}
            </span>
            <button
              
              onClick={() => deleteTodo(todo._id)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App
