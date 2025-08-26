import { useState } from "react";

export default function Heatmap(){
  const [timeSlot, setTimeSlot] = useState("3 Months");
  const [open, setOpen] = useState(false);

  const imgSrc = timeSlot === "3 Months"
    ? "/images/WorldHeatMap-1.png"
    : "/images/WorldHeatMap-2.png";

  return (
    <div className="heatmap-page">
      <div className="heatmap-toolbar">
        <button className="pill pill-outline" type="button">
          <span className="dot"/> Global View
        </button>

        <div className="filters">
          <div className="filter-group">
            <div className="filter-label">Skill</div>
            <div className="filter-box">All AI Skills</div>
          </div>
          <div className="filter-group">
            <div className="filter-label">Time Slot</div>
            <div className="dropdown">
              <button className="filter-box" onClick={() => setOpen(v=>!v)}>{timeSlot}</button>
              {open && (
                <div className="menu" onMouseLeave={()=>setOpen(false)}>
                  <button onClick={()=>{setTimeSlot("2 Weeks"); setOpen(false);}}>2 Weeks</button>
                  <button onClick={()=>{setTimeSlot("3 Months"); setOpen(false);}}>3 Months</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="heatmap-canvas">
        <img src={imgSrc} alt="World heatmap" />
      </div>
    </div>
  );
}