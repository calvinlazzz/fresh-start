import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import Quote from './Quote';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Todo() {
    const baseUrl = "http://127.0.0.1:8000/api";
    const api = useAxios();

    const token = localStorage.getItem("authTokens");
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    const [todo, setTodo] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await api.get(`/todo/${user_id}/`);
            setTodo(res.data);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while fetching todos",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    const [createTodo, setCreateTodo] = useState({ title: "", completed: "" });
    const handleNewTodoTitle = (event) => {
        setCreateTodo({
            ...createTodo,
            [event.target.name]: event.target.value
        });
    };

    const formSubmit = async () => {
        if (!createTodo.title.trim()) {
            Swal.fire({
                title: "Error",
                text: "Todo title cannot be empty",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
            return;
        }

        const formdata = new FormData();
        formdata.append("user", user_id);
        formdata.append("title", createTodo.title);
        formdata.append("completed", false);

        try {
            const res = await api.post(`/todo/${user_id}/`, formdata);
            console.log(res.data);
            Swal.fire({
                title: "Todo Added",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
            fetchTodos();
            setCreateTodo({ title: "", completed: "" });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while adding the todo",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    const markTodoAsComplete = async (todo_id) => {
        try {
            const todoItem = todo.find(todo => todo.id === todo_id);
            if (!todoItem) {
                throw new Error("Todo item not found");
            }

            const updatedStatus = !todoItem.completed;

            const formdata = new FormData();
            formdata.append("completed", updatedStatus);

            await api.patch(`/todo-detail/${user_id}/${todo_id}/`, formdata);

            Swal.fire({
                title: updatedStatus ? "Todo Marked as Complete" : "Todo Marked as Incomplete",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });

            fetchTodos();
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while updating the todo",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    const deleteTodo = async (todo_id) => {
        try {
            await api.delete(`/todo-detail/${user_id}/${todo_id}/`);
            Swal.fire({
                title: "Todo Deleted",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
            fetchTodos();
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while deleting the todo",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    const handleTitleClick = (todo) => {
        setEditingTodoId(todo.id);
        setEditingTitle(todo.title);
    };

    const handleTitleChange = (event) => {
        setEditingTitle(event.target.value);
    };

    const handleTitleBlur = async (todo_id) => {
        try {
            const formdata = new FormData();
            formdata.append("title", editingTitle);

            await api.patch(`/todo-detail/${user_id}/${todo_id}/`, formdata);

            Swal.fire({
                title: "Todo Updated",
                icon: "success",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });

            fetchTodos();
            setEditingTodoId(null);
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while updating the todo",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    const handleTitleKeyPress = (event, todo_id) => {
        if (event.key === 'Enter') {
            handleTitleBlur(todo_id);
        }
    };

    const handleNewTodoKeyPress = (event) => {
        if (event.key === 'Enter') {
            formSubmit();
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(todo);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTodo(items);

        // Send the new order to the backend
        try {
            await api.post('/update-todo-order/', { order: items.map(item => item.id) });
            console.log("Todo order updated successfully");
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while updating the todo order",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    return (
        <div>
            <div style={{ marginTop: "160px", display: "flex", justifyContent: "center" }}>
                <Quote />
            </div>
            <div className="container" style={{ marginTop: "10px", padding: "10px" }}>
                <div className="row justify-content-center align-items-center main-row">
                    <div className="col shadow main-col bg-white">
                        <div className="row text-black" style={{ backgroundColor: "#B0E0E6" }}>
                            <div className="col p-2">
                                <h4>Dailies</h4>
                            </div>
                        </div>
                        <div className="row justify-content-between text-white p-2">
                            <div className="form-group flex-fill mb-2">
                                <input
                                    id="todo-input"
                                    name='title'
                                    onChange={handleNewTodoTitle}
                                    onKeyPress={handleNewTodoKeyPress}
                                    value={createTodo.title}
                                    type="text"
                                    className="form-control"
                                    placeholder='Write a todo...'
                                />
                            </div>
                            <button type="button" onClick={formSubmit} className="btn btn-primary mb-2 ml-2" style={{ backgroundColor: "#B0E0E6" }}> Add todo </button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="todo-container">
                                {(provided) => (
                                    <div className="row" id="todo-container" {...provided.droppableProps} ref={provided.innerRef}>
                                        {todo.map((todo, index) => (
                                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div className="col col-12 p-2 todo-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <div className="input-group">
                                                            {editingTodoId === todo.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={editingTitle}
                                                                    onChange={handleTitleChange}
                                                                    onBlur={() => handleTitleBlur(todo.id)}
                                                                    onKeyPress={(event) => handleTitleKeyPress(event, todo.id)}
                                                                    className="form-control"
                                                                />
                                                            ) : (
                                                                <p className="form-control" onClick={() => handleTitleClick(todo)}>
                                                                    {todo.completed ? <strike>{todo.title}</strike> : todo.title}
                                                                </p>
                                                            )}
                                                            <div className="input-group-append">
                                                                <button
                                                                    className={`btn ${todo.completed ? 'bg-warning' : 'bg-success'} text-white ml-2`}
                                                                    type="button"
                                                                    id="button-addon2"
                                                                    onClick={() => markTodoAsComplete(todo.id)}
                                                                >
                                                                    <i className='fas fa-check'></i>
                                                                </button>
                                                                <button
                                                                    className="btn bg-danger text-white me-2 ms-2 ml-2"
                                                                    type="button"
                                                                    id="button-addon2"
                                                                    onClick={() => deleteTodo(todo.id)}
                                                                >
                                                                    <i className='fas fa-trash'></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;