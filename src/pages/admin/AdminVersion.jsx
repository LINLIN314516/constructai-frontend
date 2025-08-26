// admin/AdminVersion.jsx
import { useState } from "react";
export default function AdminVersion(){
  const [v,setV]=useState("v1");
  return (<div><h2>Admin - Version</h2>
    <select value={v} onChange={e=>setV(e.target.value)}>
      <option>v1</option><option>v2</option><option>v3</option>
    </select>
    <button onClick={()=>alert(`Rollback to ${v}`)} style={{marginLeft:8}}>Rollback</button></div>);
}