import React from "react";
export default function Sidebar(){
  const items = ["Dashboard","Nexus","Intake","Services","Invoices"];
  return (
    <aside className="sidebar">
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
        <div style={{width:40,height:40,borderRadius:8,background:"var(--accent)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>V</div>
        <div>
          <div style={{fontWeight:700}}>Vault</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>Admin</div>
        </div>
      </div>
      <div className="menu">
        {items.map(it => <div key={it} className="menu-item">{it}</div>)}
      </div>
    </aside>
  );
}
