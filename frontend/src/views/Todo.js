import React, { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import Quote from './Quote';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSpring, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';

function Todo() {
    const baseUrl = "http://127.0.0.1:8000/api";
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    console.log("Token in Todo component:", token);
    let decoded;
    if (token) {
        try {
            decoded = jwtDecode(token);
            console.log("Token decoded in Todo component:", decoded);
        } catch (error) {
            console.error('Invalid token in Todo component:', error);
            // Handle invalid token, e.g., redirect to login
        }
    }

    const user_id = decoded ? decoded.user_id : null;

    const [todo, setTodo] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [deletingTodoId, setDeletingTodoId] = useState(null);

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
            
        setTodo(prevTodos => [{ ...res.data, animation: 'fade-in' }, ...prevTodos]);
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
            const updatedProgress = updatedStatus ? 100 : 0;
    
            const formdata = new FormData();
            formdata.append("completed", updatedStatus);
            formdata.append("progress", updatedProgress);
    
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
            setDeletingTodoId(todo_id);
            setTimeout(async () => {
                await api.delete(`/todo-detail/${user_id}/${todo_id}/`);
                Swal.fire({
                    title: "Todo Deleted",
                    icon: "success",
                    toast: true,
                    timer: 2000,
                    position: "top-right",
                    timerProgressBar: true,
                });
                setTodo(prevTodos => prevTodos.filter(todo => todo.id !== todo_id));
                setDeletingTodoId(null);
            }, 500); // Match the duration of the fade-out animation
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
    const incrementProgress = async (todo_id) => {
        try {
            const todoItem = todo.find(todo => todo.id === todo_id);
            if (!todoItem) {
                throw new Error("Todo item not found");
            }

            const newProgress = Math.min(todoItem.progress + 25, 100);
            const updatedStatus = newProgress === 100;

            const formdata = new FormData();
            formdata.append("progress", newProgress);
            formdata.append("completed", updatedStatus);

            await api.patch(`/todo-detail/${user_id}/${todo_id}/`, formdata);

            Swal.fire({
                title: updatedStatus ? "Todo Marked as Complete" : "Progress Updated",
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
                text: "An error occurred while updating the progress",
                icon: "error",
                toast: true,
                timer: 2000,
                position: "top-right",
                timerProgressBar: true,
            });
        }
    };

    return (
        <div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", minHeight: "100vh" }}>
            <div style={{ marginTop: "126px", display: "flex", justifyContent: "center" }}>
                <Quote />
            </div>
            <div className="container" style={{ marginTop: "10px", padding: "10px" }}>
                <div className="row justify-content-center align-items-center main-row">
                    <div className="col shadow main-col bg-white" style={{ borderRadius: "0.5rem" }}>
                        <div className="row text-black" style={{ backgroundColor: "#B0E0E6", borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}>
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
                            <button type="button" onClick={formSubmit} className="btn btn-primary mb-2 ml-2" style={{ backgroundColor: "#B0E0E6", border: "white" }}> Add a Daily </button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="todo-container">
                                {(provided) => (
                                    <div className="row" id="todo-container" {...provided.droppableProps} ref={provided.innerRef}>
                                        {todo.map((todo, index) => (
                                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div className={`col col-12 p-2 todo-item ${todo.animation} ${deletingTodoId === todo.id ? 'fade-out' : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                                                <p className={`form-control strikethrough ${todo.completed ? 'completed' : ''}`} onClick={() => handleTitleClick(todo)}>
                                        {todo.title}
                                    </p>
                                                            )}
                                                            <div className="input-group-append">
                                                            <button
                                                                    className="btn bg-info text-white me-2 ms-2 ml-2"
                                                                    type="button"
                                                                    id="button-addon2"
                                                                    onClick={() => incrementProgress(todo.id)}
                                                                    style={{ borderRadius: "0.5rem" }}
                                                                >
                                                                    <i className='fas fa-arrow-up'></i>
                                                                </button>
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
                                                        <div className="progress mt-2" style={{ height: "10px", borderRadius: "0.5rem" }}>
                                                            <animated.div className="progress-bar" role="progressbar" style={{ width: `${todo.progress}%`, backgroundColor: "#17a2b8", borderRadius: "0.5rem" }} />
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