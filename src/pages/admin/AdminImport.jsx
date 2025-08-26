// admin/AdminImport.jsx
export default function AdminImport(){
    const onImport=e=>{ e.preventDefault(); alert("Import ok"); };
    return (<div><h2>Admin - Data Import</h2>
      <form onSubmit={onImport}><input type="file"/><button type="submit">Import</button></form></div>);
  }