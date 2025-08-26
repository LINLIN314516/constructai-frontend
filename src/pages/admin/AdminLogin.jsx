// admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminLogin(){
  const [id,setId] = useState(""); const [pwd,setPwd] = useState("");
  const nav = useNavigate();
  const onSubmit=e=>{ e.preventDefault(); if(id&&pwd) nav("/admin/import"); };
  return (<form onSubmit={onSubmit}><h2>Admin Login</h2>
    <input placeholder="Admin ID" value={id} onChange={e=>setId(e.target.value)} />
    <input placeholder="Password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
    <button type="submit">Enter</button></form>);
}