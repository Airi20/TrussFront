import React, { useState } from "react";

function App() {
  const [nodes, setNodes] = useState([{ id: 0, x: "", y: "" }]);
  const [members, setMembers] = useState([{ id: 0, start: "", end: "" }]);
  const [supports, setSupports] = useState([{ node: "", type: "pin" }]);
  const [loads, setLoads] = useState([{ node: "", fx: "", fy: "" }]);

  const handleSubmit = async () => {
    const data = {
      nodes: nodes.map(n => ({ id: Number(n.id), x: Number(n.x), y: Number(n.y) })),
      members: members.map(m => ({ id: Number(m.id), start: Number(m.start), end: Number(m.end) })),
      supports,
      loads: loads.map(l => ({ node: Number(l.node), fx: Number(l.fx), fy: Number(l.fy) })),
    };

    const res = await fetch("http://localhost:8080/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log("Result:", result);
  };

  const inputStyle = {
    marginRight: "8px",
    marginBottom: "8px",
    padding: "4px",
    width: "60px",
  };

  const labelStyle = {
    marginRight: "4px",
  };

  const sectionStyle = {
    marginBottom: "16px",
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "16px" }}>
        TrussForce Form
      </h1>

      <div style={sectionStyle}>
        <h2 style={{ fontWeight: "bold", marginBottom: "8px" }}>Nodes</h2>
        {nodes.map((n, i) => (
          <div key={i}>
            <label style={labelStyle}>ID:</label>
            <input
              style={inputStyle}
              value={n.id}
              onChange={(e) => {
                const updated = [...nodes];
                updated[i].id = e.target.value;
                setNodes(updated);
              }}
            />
            <label style={labelStyle}>X:</label>
            <input
              style={inputStyle}
              value={n.x}
              onChange={(e) => {
                const updated = [...nodes];
                updated[i].x = e.target.value;
                setNodes(updated);
              }}
            />
            <label style={labelStyle}>Y:</label>
            <input
              style={inputStyle}
              value={n.y}
              onChange={(e) => {
                const updated = [...nodes];
                updated[i].y = e.target.value;
                setNodes(updated);
              }}
            />
          </div>
        ))}
        <button
          onClick={() => setNodes([...nodes, { id: nodes.length, x: "", y: "" }])}
          style={{ marginTop: "8px", padding: "6px 12px", cursor: "pointer" }}
        >
          + Add Node
        </button>
      </div>

      {/* Members / Supports / Loads セクションも同じ感じで追加できる */}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        送信
      </button>
    </div>
  );
}

export default App;
