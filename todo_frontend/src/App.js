import React, {useEffect, useState} from "react";
import {CustomModal} from "./components/Modal";
import {ActivityFinder} from "./components/ActivityFinder";
import axios from "axios";

function App() {
  const [state, setState] = useState({
      viewCompleted: false,
      todoList: [],
      modal: false,
      finder: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      location: "",
      duration: "",
      interests: "",
      limit: "5",
      message: "",
      response: "",
      gettingData: false,
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

  
  const handleFindSubmit = (location, duration, interests, limit) => {

    setState((prev) => ({...prev, location: location, duration: duration, interests: interests, limit: limit, gettingData: true}));
    try {
      // TODO fill in the api to call
      axios
        .post('http://127.0.0.1:8000/api/some-api/', 
          { "some-data" : "some value" })
        .then((res) => 
          { setState((prev) => ({...prev, gettingData: false}));
            toggleFinder();
            refreshList(); })
        // if we really wanted to catch the error to handle it
        // uncomment below
        //.catch((error) => {
        //  console.error('Error calling /find-activities/:', error);
        //})
        ;
    } catch (error) {
      setState((prev) => ({...prev, gettingData:false}));
      console.error('Error setting up axios call', error);
    }
  };

  const handleDelete = (item) => {
    axios
      .delete(`/api/tasks/${item.id}/`)
      .then((res) => refreshList());
  };

  const toggleFinder = () => {
    setState((prev) => ({...prev, finder: !prev.finder }));
  };

  const findActivities = () => {
    setState((prev) => ({...prev, finder: !prev.finder }));
  };


  const createItem = () => {
    const item = {title: "", description: "", completed: false};
    setState((prev) => ({...prev, activeItem: item, modal: !prev.modal}));
  };

  
  const editItem = (item) => {
    setState((prev) => ({...prev, activeItem: item, modal: !prev.modal}));
  };

  const findSimilar = (item, limit) => {
    try {
      setState((prev) => ({...prev, gettingData : true}));
      // TODO - fill in api to call
      axios
        .post('http://127.0.0.1:8000/api/some-api/', 
          { "some-data" : "some value"})
        .then((res) => 
          {
            setState((prev) => ({...prev, gettingData: false}));
            refreshList();
           });
    } catch (error) {
      setState((prev) => ({...prev, gettingData: false}));
      console.error('Error finding similar activities', error);
    }
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
    const { viewCompleted } = state;
    const newItems = state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <tr>    
        <td>
          {item.title}
        </td>
        <td>
          {item.description}
        </td>
        <td>
          {item.duration}
        </td>
        <td>
          {item.cost}
        </td>
        <td>
          {item.notes}
        </td>
        <td>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-secondary mr-2"
            style={{ cursor: state.gettingData ? 'wait' : 'default' }}
            onClick={() => findSimilar(item, state.limit)}
          >
            Find Similar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(item)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

    return (
      <main className="container" id="main" style={{ cursor: state.gettingData ? 'wait' : 'default' }}>
        <h1 className="text-uppercase text-center my-4">Activity Planner</h1>
        <h4 className="text-center my-4">Planning a trip or just looking for something to do?  Use the Activity Planner to find activities that suit YOUR interests!</h4>
        <div className="row">
          <div className="col-md-12 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4" >
                <button
                  className="btn btn-primary mx-1"
                  onClick={createItem}
                >
                  Add Activity
                </button>
                <button
                  className="btn btn-primary"
                  onClick={findActivities}
                >
                  Find Activities
                </button>

              </div>
              {renderTabList()}
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">Description</th>
                    <th scope="col">Time</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Notes</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>              
                {renderItems()}
                </tbody>
              </table>
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
        {state.finder ? (
          <ActivityFinder
            location={state.location}
            duration={state.duration}
            interests={state.interests}
            limit={state.limit}
            toggle={toggleFinder}
            onFind={handleFindSubmit}
            gettingData={state.gettingData}
          />
        ) : null}        
      </main>
    );
  }


export default App;
