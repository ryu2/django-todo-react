import React, {useEffect, useState} from "react";
import {CustomModal} from "./components/Modal";
import axios from "axios";

function App() {
  const [state, setState] = useState({
    viewCompleted: false,
    todoList: [],
    modal: false,
    activeItem: {
      title: "",
      description: "",
      completed: false,
    },
    message: "",
    response: "",
  });

  useEffect(() => {
    refreshList();
  }, [])

  const refreshList = () => {
    axios
      .get("/api/tasks/")
      .then((res) => setState(prev => ({...prev, todoList: res.data})))
      .catch((err) => console.log(err));
  }

  const toggle = () => {
    setState((prev) => ({...prev, modal: !prev.modal}));
  };

  const handleSubmit = (item) => {
    toggle();

    if (item.id) {
      axios
        .put(`/api/tasks/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    axios
      .post("/api/tasks/", item)
      .then((res) => refreshList());
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();

    try {
      axios
        .post('http://127.0.0.1:8000/api/generate-text/', {prompt: state.message})
        .then((res) => setState(prev => ({...prev, response: res.data["data"]})));
    } catch (error) {
      console.error('Error chatting with GPT:', error);
    }
  };

  const handleDelete = (item) => {
    axios
      .delete(`/api/tasks/${item.id}/`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item = {title: "", description: "", completed: false};
    setState((prev) => ({...prev, activeItem: item, modal: !prev.modal}));
  };

  const editItem = (item) => {
    setState((prev) => ({...prev, activeItem: item, modal: !prev.modal}));
  };

  const displayCompleted = (status) => {
    setState((prev) => ({...prev, viewCompleted: status}));
  };

  const renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => displayCompleted(true)}
          className={state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const {viewCompleted} = state;
    const newItems = state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  return (
    <main className="container">
      <h1 className="text-uppercase text-center my-4">Todo app</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button
                className="btn btn-primary"
                onClick={() => createItem()}
              >
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      {state.modal ? (
        <CustomModal
          activeItem={state.activeItem}
          toggle={() => toggle()}
          onSave={(task) => handleSubmit(task)}
        />
      ) : null}
      <div className="row text-center">
        <h2>Summarize tasks with GPT</h2>
        <form onSubmit={(e) => handleChatSubmit(e)}>
            <textarea
              value={state.message}
              onChange={(e) => setState((prev) => ({...prev, message: e.target.value}))}
              rows="4"
              cols="50"
            />
          <br/>
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
        {state.response && (
          <div>
            <h2>Response:</h2>
            <p>{state.response}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
