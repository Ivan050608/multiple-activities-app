'use client'
import { useEffect, useState } from 'react'
import { getTodos, createTodo, updateTodo, deleteTodo, getCurrentUser } from '@/lib/supabaseClient'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Get the user ID from Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        setError('User is not authenticated')
        setLoading(false)
        return
      }

      try {
        const data = await getTodos(user.id)
        setTodos(data)
      } catch (error) {
        console.error('Error fetching todos:', error)
        setError('Error fetching todos')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTodos()
    }
  }, [user])

//   const handleCreateTodo = async (e) => {
//     e.preventDefault()
//     if (!user) {
//       setError('User is not authenticated')
//       return
//     }
//     if (task.trim() === '') return

//     try {
//       const newTodo = await createTodo(user.id, task)
//       setTodos([newTodo[0], ...todos])
//       setTask('') // Reset task input
//     } catch (error) {
//       console.error('Error creating todo:', error)
//       setError('Error creating todo')
//     }
//   }

const handleCreateTodo = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('User is not authenticated')
      return
    }
    if (task.trim() === '') return
  
    try {
      const newTodo = await createTodo(user.id, task)
      const updatedTodos = await getTodos(user.id)  // Fetch updated todos after creation
      setTodos(updatedTodos)  // Update state with the fresh data from Supabase
      setTask('') // Reset task input
    } catch (error) {
      console.error('Error creating todo:', error)
      setError('Error creating todo')
    }
  }
  

  const handleUpdateTodo = async (id, completed) => {
    try {
      await updateTodo(id, completed)
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Error updating todo')
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      setError('Error deleting todo')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">To-Do List</h1>
        {/* Create To-Do Form */}
        <form onSubmit={handleCreateTodo} className="mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter new task"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded ml-2">Add Task</button>
        </form>

        {/* Display To-Dos */}
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center mb-2">
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.task}
              </span>
              <div>
                <button
                  onClick={() => handleUpdateTodo(todo.id, !todo.completed)}
                  className="px-2 py-1 text-white bg-yellow-500 rounded mr-2"
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  )
}
