import { useEffect, useState } from "react";
import axios from 'axios';


const Todo = () => {
  const [taskTitle, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [allTasks, setallTasks] = useState([]);
  const [editIndex, seteditIndex] = useState(null);
  const [editTaskTitle, seteditTaskTitle] = useState("");
  const [editDescription, seteditDescription] = useState("");
  const [count, setcount] = useState(0);

  const url = 'http://localhost:5000/todo'
  useEffect(() => {
    axios.get(url)
    .then((response)=>{
      console.log(response);
      setallTasks(response.data.everyTodo)
      setcount(response.data.everyTodo.length)
    })
  }, [])
  

  // console.log(task, description);
  // console.log(editDescription, editTaskTitle, editIndex);

  const submitTask = () => {
    // alert('yes')
    if (taskTitle.trim() === "" || description.trim() === "") {
      alert("Input(s) can not be empty, fill in something");
    } else {
    const todo = { taskTitle, description };
    axios.post(url, todo)
    .then((response)=>{
      if(response.status === 201){
        setallTasks([...allTasks, response.data.todoList]);
        setcount(count + 1);
        setTask("");
        setDescription("");
        // console.log(todo); 
      }else{
        console.log(`No response from backend`);
      }
    })
    .catch((err)=>{
      console.log(err);    
    })
    }
  };

  const deleteTodo = (index) => {
    // alert('yes')
    const confirmation = window.confirm("Are you sure you want to delete?");
    if (confirmation) {
      const userId = allTasks[index]._id
      axios.delete(`${url}/${userId}`)
      .then((res)=>{
        if(res.status === 200){
          setallTasks(allTasks.filter((task, i) => i !== index));
          setcount(count - 1);
        }
      })
      .catch((err)=>{
        console.log(err); 
      })
    }
  };

  const editTodo = (index) => {
    //  console.log(index);
    seteditIndex(index);
    seteditTaskTitle(allTasks[index].taskTitle);
    seteditDescription(allTasks[index].description);
  };

  const saveEditedTask = () => {
    // alert('yes')
    if (editIndex !== null) {
      const newTasks = [...allTasks];
      newTasks[editIndex] = {
        taskTitle: editTaskTitle,
        description: editDescription,
      };
      setallTasks(newTasks);
      seteditTaskTitle("");
      seteditDescription("");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center text-primary">Todo App</h2>

      <div className="card shadow-sm p-4 mb-4">
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label fw-semibold">
            Task Title
          </label>
          <input
            id="taskTitle"
            type="text"
            className="form-control shadow-none"
            placeholder="Enter task title"
            value={taskTitle}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="taskDesc" className="form-label fw-semibold">
            Task Description
          </label>
          <input
            id="taskDesc"
            type="text"
            className="form-control shadow-none"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 fw-bold"
          type="button"
          onClick={submitTask}
        >
          Add Task
        </button>
      </div>
      <div className="card-header bg-secondary text-white fw-semibold mb-3 p-3 rounded">
        Your Tasks ({count})
      </div>
      {allTasks.map((task, i) => (
        <div className="card shadow-sm my-3" key={i}>
          <ul className="list-group list-group-flush">
            <li className="list-group-item text-center text-muted p-3 shadow">
              <p className="fw-bold text-secondary">Task {i+1}</p>
              <span className="fw-bold">Task Title: </span>
              {task.taskTitle}
              <br />
              <span className="fw-bold">Task Description: </span>
              {task.description}
              <br />
              <button
                className="btn btn-primary w-25"
                onClick={() => editTodo(i)}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Edit
              </button>
              <button
                className="btn btn-danger w-25 m-2"
                onClick={() => deleteTodo(i)}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      ))}

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit your Todo
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control shadow-none mb-3"
                value={editTaskTitle}
                placeholder="Enter new task"
                onChange={(e) => seteditTaskTitle(e.target.value)}
              />
              <input
                type="text"
                className="form-control shadow-none mt-3"
                value={editDescription}
                placeholder="Description"
                onChange={(e) => seteditDescription(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveEditedTask}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
