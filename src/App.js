import React, { useState } from "react";

function App() {
  const [nodes, setNodes] = useState([
    { id: 0, x: "", y: "", supportX: false, supportY: false, loadX: "", loadY: "" }
  ]);
  const [members, setMembers] = useState([{ startNode: 0, endNode: 1 }]);
  const [result, setResult] = useState(null);

  const handleNodeChange = (index, field, value) => {
    const newNodes = [...nodes];
    newNodes[index][field] =
      field === "id" ? parseInt(value) :
      field === "supportX" || field === "supportY" ? value === "true" :
      value;
    setNodes(newNodes);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = parseInt(value) || 0;
    setMembers(newMembers);
  };

  const addNode = () => {
    setNodes([
      ...nodes,
      { id: nodes.length, x: "", y: "", supportX: false, supportY: false, loadX: "", loadY: "" }
    ]);
  };

  const addMember = () => {
    setMembers([...members, { startNode: 0, endNode: 0 }]);
  };

  // ここで削除関数はreturnの外に普通に書く
  const removeNode = (index) => {
    setNodes(nodes.filter((_, i) => i !== index));
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const cleanNodes = nodes.map(n => ({
      ...n,
      x: parseFloat(n.x) || 0,
      y: parseFloat(n.y) || 0,
      loadX: parseFloat(n.loadX) || 0,
      loadY: parseFloat(n.loadY) || 0
    }));
    const payload = { nodes: cleanNodes, members };

    try {
      const response = await fetch("https://trussback-1.onrender.com/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setResult(data);
      alert("送信成功！いい感じ！");
    } catch (error) {
      console.error("送信失敗:", error);
      alert("送信失敗... コンソール確認して！");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌉 TrussForce Builder</h1>

      <h2>接点 (Nodes)</h2>
      {nodes.map((node, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          ID: <input type="number" value={node.id} onChange={(e) => handleNodeChange(index, "id", e.target.value)} />
          X: <input type="text" value={node.x} onChange={(e) => handleNodeChange(index, "x", e.target.value)} />
          Y: <input type="text" value={node.y} onChange={(e) => handleNodeChange(index, "y", e.target.value)} />
          支点X:
          <select value={node.supportX} onChange={(e) => handleNodeChange(index, "supportX", e.target.value)}>
            <option value="false">なし</option>
            <option value="true">固定</option>
          </select>
          支点Y:
          <select value={node.supportY} onChange={(e) => handleNodeChange(index, "supportY", e.target.value)}>
            <option value="false">なし</option>
            <option value="true">固定</option>
          </select>
          荷重X: <input type="text" value={node.loadX} onChange={(e) => handleNodeChange(index, "loadX", e.target.value)} />
          荷重Y: <input type="text" value={node.loadY} onChange={(e) => handleNodeChange(index, "loadY", e.target.value)} />
          <button onClick={() => removeNode(index)} style={{ marginLeft: 8, color: "red" }}>削除</button>
        </div>
      ))}
      <button onClick={addNode}>+ ノード追加</button>

      <h2>部材 (Members)</h2>
      {members.map((member, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          Start: <input type="number" value={member.startNode} onChange={(e) => handleMemberChange(index, "startNode", e.target.value)} />
          End: <input type="number" value={member.endNode} onChange={(e) => handleMemberChange(index, "endNode", e.target.value)} />
          <button onClick={() => removeMember(index)} style={{ marginLeft: 8, color: "red" }}>削除</button>
        </div>
      ))}
      <button onClick={addMember}>+ 部材追加</button>

      <hr />
      <button onClick={handleSubmit}>🚀 送信</button>

      {result && (
  <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 10 }}>
    <h2>計算結果</h2>

    <h3>反力X</h3>
    <ul>
      {Object.entries(result.reactionsX).map(([nodeId, force]) => (
        <li key={nodeId}>ノード {nodeId}: {force}</li>
      ))}
    </ul>

    <h3>反力Y</h3>
    <ul>
      {Object.entries(result.reactionsY).map(([nodeId, force]) => (
        <li key={nodeId}>ノード {nodeId}: {force}</li>
      ))}
    </ul>

    <h3>部材力（ソート済み）</h3>
    <ul>
      {Object.entries(result.memberForces)
        .sort((a, b) => {
          const [startA, endA] = a[0].split("-").map(Number);
          const [startB, endB] = b[0].split("-").map(Number);
          return startA !== startB ? startA - startB : endA - endB;
        })
        .map(([memberName, force]) => (
          <li key={memberName}>{memberName}: {force}</li>
        ))}
    </ul>
  </div>
)}

    </div>
  );
}

export default App;
