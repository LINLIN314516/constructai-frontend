import { useState } from "react";

export default function Heatmap(){
  const [timeSlot, setTimeSlot] = useState("3 Months");
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleCountry, setBubbleCountry] = useState(null);

  const imgSrc = timeSlot === "3 Months"
    ? "/images/WorldHeatMap-1.png"
    : "/images/WorldHeatMap-2.png";

  // 2 Weeks 数据
  const data2Weeks = {
    canada: {
      title: "Canada",
      subtitle: "#6 Globally in last 2 weeks",
      marketShare: "12% of AI-related job postings are from construction industry (#6)",
      adoptionRate: "11.8% of construction-related jobs need AI skills (#5)",
      jobVolume: "1,156 positions needed (#6)"
    },
    usa: {
      title: "America",
      subtitle: "#2 Globally in last 2 weeks",
      marketShare: "19% of AI-related job postings are from construction industry (#2)",
      adoptionRate: "14.2% of construction-related jobs need AI skills (#3)",
      jobVolume: "3,726 positions needed (#3)"
    },
    brazil: {
      title: "Brazil",
      subtitle: "#8 Globally in last 2 weeks",
      marketShare: "10% of AI-related job postings are from construction industry (#8)",
      adoptionRate: "9.1% of construction-related jobs need AI skills (#7)",
      jobVolume: "1,045 positions needed (#8)"
    },
    spain: {
      title: "Spain",
      subtitle: "#8 Globally in last 2 weeks",
      marketShare: "7% of AI-related job postings are from construction industry (#8)",
      adoptionRate: "8.9% of construction-related jobs need AI skills (#8)",
      jobVolume: "523 positions needed (#8)"
    },
    uk: {
      title: "United Kingdom",
      subtitle: "#3 Globally in last 2 weeks",
      marketShare: "16% of AI-related job postings are from construction industry (#3)",
      adoptionRate: "15.1% of construction-related jobs need AI skills (#2)",
      jobVolume: "1,834 positions needed (#5)"
    },
    china: {
      title: "China",
      subtitle: "#1 Globally in last 2 weeks",
      marketShare: "24% of AI-related job postings are from construction industry (#1)",
      adoptionRate: "15.8% of construction-related jobs need AI skills (#1)",
      jobVolume: "6,847 positions needed (#1)"
    },
    india: {
      title: "India",
      subtitle: "#4 Globally in last 2 weeks",
      marketShare: "14% of AI-related job postings are from construction industry (#4)",
      adoptionRate: "12.3% of construction-related jobs need AI skills (#4)",
      jobVolume: "2,947 positions needed (#4)"
    },
    australia: {
      title: "Australia",
      subtitle: "#5 Globally in last 2 weeks",
      marketShare: "14% of AI-related job postings are from construction industry (#4)",
      adoptionRate: "11.8% of construction-related jobs need AI skills (#6)",
      jobVolume: "967 positions needed (#7)"
    },
    russia: {
      title: "Russia",
      subtitle: "#9 Globally in last 2 weeks",
      marketShare: "6% of AI-related job postings are from construction industry (#9)",
      adoptionRate: "7.1% of construction-related jobs need AI skills (#9)",
      jobVolume: "371 positions needed (#9)"
    }
  };

  // 3 Months 数据
  const data3Months = {
    canada: {
      title: "Canada",
      subtitle: "#5 Globally in last 3 months",
      marketShare: "12% of AI-related job postings are from construction industry (#6)",
      adoptionRate: "13.5% of construction-related jobs need AI skills (#5)",
      jobVolume: "4,892 positions needed (#3)"
    },
    usa: {
      title: "America",
      subtitle: "#2 Globally in last 3 months",
      marketShare: "20% of AI-related job postings are from construction industry (#2)",
      adoptionRate: "14.7% of construction-related jobs need AI skills (#3)",
      jobVolume: "15,847 positions needed (#3)"
    },
    brazil: {
      title: "Brazil",
      subtitle: "#8 Globally in last 3 months",
      marketShare: "8% of AI-related job postings are from construction industry (#8)",
      adoptionRate: "11.2% of construction-related jobs need AI skills (#7)",
      jobVolume: "8,736 positions needed (#2)"
    },
    spain: {
      title: "Spain",
      subtitle: "#7 Globally in last 3 months",
      marketShare: "10% of AI-related job postings are from construction industry (#7)",
      adoptionRate: "9.8% of construction-related jobs need AI skills (#8)",
      jobVolume: "2,194 positions needed (#8)"
    },
    uk: {
      title: "United Kingdom",
      subtitle: "#4 Globally in last 3 months",
      marketShare: "15% of AI-related job postings are from construction industry (#4)",
      adoptionRate: "15.3% of construction-related jobs need AI skills (#2)",
      jobVolume: "7,283 positions needed (#3)"
    },
    china: {
      title: "China",
      subtitle: "#1 Globally in last 3 months",
      marketShare: "25% of AI-related job postings are from construction industry (#1)",
      adoptionRate: "16.2% of construction-related jobs need AI skills (#1)",
      jobVolume: "28,394 positions needed (#1)"
    },
    india: {
      title: "India",
      subtitle: "#3 Globally in last 3 months",
      marketShare: "18% of AI-related job postings are from construction industry (#2)",
      adoptionRate: "12.8% of construction-related jobs need AI skills (#3)",
      jobVolume: "11,526 positions needed (#4)"
    },
    australia: {
      title: "Australia",
      subtitle: "#6 Globally in last 3 months",
      marketShare: "14% of AI-related job postings are from construction industry (#5)",
      adoptionRate: "11.9% of construction-related jobs need AI skills (#6)",
      jobVolume: "3,547 positions needed (#7)"
    },
    russia: {
      title: "Russia",
      subtitle: "#9 Globally in last 3 months",
      marketShare: "6% of AI-related job postings are from construction industry (#9)",
      adoptionRate: "7.3% of construction-related jobs need AI skills (#9)",
      jobVolume: "1,658 positions needed (#9)"
    }
  };

  const currentData = timeSlot === "2 Weeks" ? data2Weeks : data3Months;

  const renderBubble = (country) => {
    if (!showBubble || bubbleCountry !== country) return null;
    
    const data = currentData[country];
    const isAustralia = country === 'australia';
    
    return (
      <div className={`${country}-bubble`}>
        <button className="bubble-close" onClick={() => setShowBubble(false)}>×</button>
        <div className="bubble-header">
          <div className="bubble-title">{data.title}</div>
          <div className="bubble-subtitle">{data.subtitle}</div>
        </div>
        <div className="bubble-section">
          <div className="section-title">Market Share:</div>
          <div className="section-text">{data.marketShare}</div>
        </div>
        <div className="bubble-section">
          <div className="section-title">Adoption Rate:</div>
          <div className="section-text">{data.adoptionRate}</div>
        </div>
        <div className="bubble-section">
          <div className="section-title">Job Volume:</div>
          <div className="section-text">{data.jobVolume}</div>
        </div>
        <div className="bubble-actions">
          {isAustralia && <button className="country-view-btn">Country View</button>}
          <button className="export-btn">Export</button>
        </div>
      </div>
    );
  };

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
        <div className="map-click-area canada-area" onClick={() => { setShowBubble(true); setBubbleCountry('canada'); }} />
        <div className="map-click-area usa-area" onClick={() => { setShowBubble(true); setBubbleCountry('usa'); }} />
        <div className="map-click-area brazil-area" onClick={() => { setShowBubble(true); setBubbleCountry('brazil'); }} />
        <div className="map-click-area spain-area" onClick={() => { setShowBubble(true); setBubbleCountry('spain'); }} />
        <div className="map-click-area uk-area" onClick={() => { setShowBubble(true); setBubbleCountry('uk'); }} />
        <div className="map-click-area china-area" onClick={() => { setShowBubble(true); setBubbleCountry('china'); }} />
        <div className="map-click-area india-area" onClick={() => { setShowBubble(true); setBubbleCountry('india'); }} />
        <div className="map-click-area australia-area" onClick={() => { setShowBubble(true); setBubbleCountry('australia'); }} />
        <div className="map-click-area russia-area" onClick={() => { setShowBubble(true); setBubbleCountry('russia'); }} />
        
        {renderBubble('canada')}
        {renderBubble('usa')}
        {renderBubble('brazil')}
        {renderBubble('spain')}
        {renderBubble('uk')}
        {renderBubble('china')}
        {renderBubble('india')}
        {renderBubble('australia')}
        {renderBubble('russia')}
      </div>
    </div>
  );
}