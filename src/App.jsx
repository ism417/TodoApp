import {useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://todo-api-henna.vercel.app/api/todos';

function App(){
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  async function checkAuth() {
    try {
      const res = await fetch('https://todo-api-henna.vercel.app/api/auth/user', {
        credentials: 'include'
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function login() {
    window.location.href = 'https://todo-api-henna.vercel.app/api/auth/google';
  }

  async function logout() {
    await fetch('https://todo-api-henna.vercel.app/api/auth/logout', {
      credentials: 'include'
    });
    setUser(null);
    setTodos([]);
  }

  async function fetchTodos() {
    const res = await fetch(API_URL, {
      credentials: 'include'
    });
    if (res.ok){
      const data = await res.json();
      setTodos(data);
    }
  }
  async function addTodo(e){
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-Type': 'application/json'},
      body: JSON.stringify({ title }),
      credentials: 'include'
    });
    if (res.ok){
      setTitle('');
      fetchTodos();
    }
  }
  async function toggleComplete(todo) {
    await fetch(`${API_URL}/${todo._id}`, {
      method: 'PUT',
      headers: { 'content-Type': 'application/json'},
      body: JSON.stringify({ completed: !todo.completed }),
      credentials: 'include'
    });
    fetchTodos();
  }
  async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include'});
    fetchTodos();
  }
  if (loading) {
    return <div className='app-container'>Loading...</div>;
  }
  if (!user) {
    return (
      <div className='app-container'>
        <h1>My Todo List</h1>
        <p>Please sign in to manage your todos</p>
        <button onClick={login}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div className='app-container'  >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Todo List</h1>
        <div>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>

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
