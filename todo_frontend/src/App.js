import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      isLoading: false
    };
  }

  componentDidMount() {
    this.refreshList();
  }


  refreshList = () => {
    axios
      .get("/api/tasks/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/tasks/", item)
      .then((res) => this.refreshList());
  }; 

  handleDelete = (item) => {
    axios
      .delete(`/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  genSubTasks = (item) => {
    try {
      this.setState({isLoading: true});
      axios
        .post('http://127.0.0.1:8000/api/generate-sub-tasks/', { "task-id":item.id, "limit": 3 , "delete-parent": true})
        .then((res) => {
          this.setState({ isLoading: false});
          this.refreshList();
          }
        )
    } catch (error) {
      this.setState({ isLoading: false});
      console.error('Error generating sub tasks:', error);
    }
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button class="btn" title="Edit" onClick={() => this.editItem(item)}><i class="fa fa-pencil"></i></button>
          <button class="btn" title="Generate sub tasks"
            style={{ cursor: this.state.isLoading ? 'wait' : 'default' }}
            onClick={() => this.genSubTasks(item)}><i class="fa fa-list"></i></button>
          <button class="btn" title="Delete" onClick={() => this.handleDelete(item)}><i class="fa fa-trash"></i></button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container"  style={{ cursor: this.state.isLoading ? 'wait' : 'default' }}>
        <h1 className="text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-10 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
