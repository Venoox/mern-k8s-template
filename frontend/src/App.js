import React, { useState, useEffect } from "react";
import "./App.css";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const API_URL = development ? "http://localhost:3001" : "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api`)
      .then((res) => res.json())
      .then((res) => setTasks(res));
  }, []);

  const addToList = async (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api`, { method: "POST", body: JSON.stringify({ description }), headers: { "Content-Type": "application/json" } })
      .then((res) => res.json())
      .then((res) => setTasks([...tasks, { id: res.id, description }]));
  };

  return (
    <div className="App">
      <h3>Beleznica nalog</h3>
      <form onSubmit={addToList}>
        <label>Vpisi opis naloge:</label>
        <br />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="submit" value="Dodaj" />
      </form>
      <div>
        {tasks.map((task) => (
          <div key={task.id}>{task.description}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
