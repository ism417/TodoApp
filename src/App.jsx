import {useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://todo-api-henna.vercel.app/api/todos';

function App(){
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check for token in URL (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      setToken(tokenFromUrl);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  async function checkAuth() {
    try {
      const res = await fetch('https://todo-api-henna.vercel.app/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  function login() {
    window.location.href = 'https://todo-api-henna.vercel.app/api/auth/google';
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTodos([]);
  }

  async function fetchTodos() {
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok){
      const data = await res.json();
      setTodos(data);
    }
  }

  async function addTodo(e){
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    if (res.ok){
      setTitle('');
      fetchTodos();
    }
  }

  async function toggleComplete(todo) {
    await fetch(`${API_URL}/${todo._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !todo.completed })
    });
    fetchTodos();
  }

  async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchTodos();
  }

  if (loading) {
    return <div className='app-container'>Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <div className='app-container'>
          <div style={{ display: 'grid'}}>
            <h1>My Todo List</h1>
            <p style={{ color: '#000', margin: '20px'}}>Please sign in to manage your todos</p>
            <button onClick={login}>Sign in with Google</button>
          </div>
        </div>
        <footer className="fixed bottom-2 left-0 right-0 text-center">
          <a 
            href="https://ismail-el-abbassi.live" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black text-xs hover:text-gray-700 transition-colors"
          >
            Built by Your Ismail El Abbassi
          </a>
        </footer>
      </>
    );
  }

  return (
    <>
    <div className='app-container'>
      <div style={{ display: 'grid', alignItems: 'center', justifyItems:'center' , marginBottom: '20px' }}> 
        <h1>My Todo List</h1>
        <span style={{ color: '#000'}} > Welcome, {user.name}!</span>
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
            <button onClick={() => deleteTodo(todo._id)}>
              ✖
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: 'grid', alignItems: 'center', justifyItems:'center' , marginTop: '50px', marginBottom: '1px' }}> 
        <button onClick={logout} >Logout</button>
      </div>
    </div>
        <footer className="fixed bottom-2 left-0 right-0 text-center">
          <a 
            href="https://ismail-el-abbassi.live" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black text-xs hover:text-gray-700 transition-colors"
          >
            Built by Your Ismail El Abbassi
          </a>
        </footer>
    </>
  );
}

export default App
