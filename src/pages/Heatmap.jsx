import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Heatmap(){
  const [searchParams] = useSearchParams();
  const [timeSlot, setTimeSlot] = useState("3 Months");
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleCountry, setBubbleCountry] = useState(null);
  const [viewMode, setViewMode] = useState("global"); // "global" 或 "australia"
  const [showAusBubble, setShowAusBubble] = useState(false);
  const [ausBubbleState, setAusBubbleState] = useState(null);

  // 处理 URL 参数
  useEffect(() => {
    const view = searchParams.get('view');
    const timeSlotParam = searchParams.get('timeSlot');
    
    if (view === 'australia') {
      setViewMode('australia');
    }
    
    if (timeSlotParam === '3Months') {
      setTimeSlot('3 Months');
    } else if (timeSlotParam === '2Weeks') {
      setTimeSlot('2 Weeks');
    }
  }, [searchParams]);

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

  // 澳大利亚州数据配置 - 2 Weeks
  const ausStatesData2Weeks = {
    victoria: {
      title: "Victoria",
      subtitle: "#1 in Australia in last 2 weeks",
      marketShare: "33% of AI-related job postings are from construction industry (#1)",
      adoptionRate: "12.8% of construction-related jobs need AI skills (#1)",
      jobVolume: "467 positions needed (#1)"
    },
    nsw: {
      title: "New South Wales",
      subtitle: "#2 in Australia in last 2 weeks",
      marketShare: "22% of AI-related job postings are from construction industry (#2)",
      adoptionRate: "11.2% of construction-related jobs need AI skills (#3)",
      jobVolume: "289 positions needed (#2)"
    },
    queensland: {
      title: "Queensland",
      subtitle: "#3 in Australia in last 2 weeks",
      marketShare: "26% of AI-related job postings are from construction industry (#3)",
      adoptionRate: "12.1% of construction-related jobs need AI skills (#2)",
      jobVolume: "283 positions needed (#3)"
    },
    southAustralia: {
      title: "South Australia",
      subtitle: "#4 in Australia in last 2 weeks",
      marketShare: "13% of AI-related job postings are from construction industry (#4)",
      adoptionRate: "11.5% of construction-related jobs need AI skills (#4)",
      jobVolume: "154 positions needed (#4)"
    },
    westernAustralia: {
      title: "Western Australia",
      subtitle: "#5 in Australia in last 2 weeks",
      marketShare: "4% of AI-related job postings are from construction industry (#5)",
      adoptionRate: "8.9% of construction-related jobs need AI skills (#5)",
      jobVolume: "52 positions needed (#5)"
    },
    tasmania: {
      title: "Tasmania",
      subtitle: "#6 in Australia in last 2 weeks",
      marketShare: "2% of AI-related job postings are from construction industry (#6)",
      adoptionRate: "7.4% of construction-related jobs need AI skills (#6)",
      jobVolume: "21 positions needed (#6)"
    },
    northernTerritory: {
      title: "Northern Territory",
      subtitle: "#7 in Australia in last 2 weeks",
      marketShare: "No Sufficient Valid Data",
      adoptionRate: "No Sufficient Valid Data",
      jobVolume: "No Sufficient Valid Data"
    }
  };

  // 澳大利亚州数据配置 - 3 Months
  const ausStatesData3Months = {
    victoria: {
      title: "Victoria",
      subtitle: "#2 in Australia in last 3 months",
      marketShare: "28% of AI-related job postings are from construction industry (#2)",
      adoptionRate: "12.5% of construction-related jobs need AI skills (#2)",
      jobVolume: "1,394 positions needed (#2)"
    },
    nsw: {
      title: "New South Wales",
      subtitle: "#1 in Australia in last 3 months",
      marketShare: "35% of AI-related job postings are from construction industry (#1)",
      adoptionRate: "13.2% of construction-related jobs need AI skills (#1)",
      jobVolume: "1,847 positions needed (#1)"
    },
    queensland: {
      title: "Queensland",
      subtitle: "#3 in Australia in last 3 months",
      marketShare: "18% of AI-related job postings are from construction industry (#3)",
      adoptionRate: "10.8% of construction-related jobs need AI skills (#4)",
      jobVolume: "892 positions needed (#3)"
    },
    southAustralia: {
      title: "South Australia",
      subtitle: "#5 in Australia in last 3 months",
      marketShare: "5% of AI-related job postings are from construction industry (#5)",
      adoptionRate: "9.3% of construction-related jobs need AI skills (#5)",
      jobVolume: "186 positions needed (#5)"
    },
    westernAustralia: {
      title: "Western Australia",
      subtitle: "#4 in Australia in last 3 months",
      marketShare: "12% of AI-related job postings are from construction industry (#4)",
      adoptionRate: "11.7% of construction-related jobs need AI skills (#3)",
      jobVolume: "547 positions needed (#4)"
    },
    tasmania: {
      title: "Tasmania",
      subtitle: "#6 in Australia in last 3 months",
      marketShare: "2% of AI-related job postings are from construction industry (#7)",
      adoptionRate: "7.8% of construction-related jobs need AI skills (#8)",
      jobVolume: "73 positions needed (#8)"
    },
    northernTerritory: {
      title: "Northern Territory",
      subtitle: "#7 in Australia in last 3 months",
      marketShare: "No Sufficient Valid Data",
      adoptionRate: "No Sufficient Valid Data",
      jobVolume: "No Sufficient Valid Data"
    }
  };

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
          {isAustralia && (
            <button 
              className="country-view-btn" 
              onClick={() => setViewMode("australia")}
            >
              Country View
            </button>
          )}
          <button className="export-btn">Export</button>
        </div>
      </div>
    );
  };

  // 渲染澳大利亚州气泡
  const renderAusBubble = (state) => {
    if (!showAusBubble || ausBubbleState !== state) return null;
    
    const currentAusData = timeSlot === "2 Weeks" ? ausStatesData2Weeks : ausStatesData3Months;
    const data = currentAusData[state];
    
    return (
      <div className={`aus-${state}-bubble`}>
        <button className="bubble-close" onClick={() => setShowAusBubble(false)}>×</button>
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
          <button className="export-btn">Export</button>
        </div>
      </div>
    );
  };

  return (
    <div className="heatmap-page">
      <div className="heatmap-toolbar">
        {viewMode === "global" ? (
          <button className="pill pill-outline" type="button">
            <span className="dot"/> Global View
          </button>
        ) : (
          <div className="view-toggle">
            <button 
              className="pill pill-outline" 
              onClick={() => setViewMode("global")}
            >
              <span className="dot"/> Global View
            </button>
            <button className="pill pill-active">
              🇦🇺 Australia
            </button>
          </div>
        )}

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
        {viewMode === "global" ? (
          <>
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
          </>
        ) : (
          <>
            <img src={timeSlot === "2 Weeks" ? "/images/AusHeatMap-1.png" : "/images/AusHeatMap-2.png"} alt="Australia heatmap" />
            <div className="aus-click-area aus-victoria-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('victoria'); }} />
            <div className="aus-click-area aus-nsw-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('nsw'); }} />
            <div className="aus-click-area aus-queensland-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('queensland'); }} />
            <div className="aus-click-area aus-south-australia-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('southAustralia'); }} />
            <div className="aus-click-area aus-western-australia-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('westernAustralia'); }} />
            <div className="aus-click-area aus-tasmania-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('tasmania'); }} />
            <div className="aus-click-area aus-northern-territory-area" onClick={() => { setShowAusBubble(true); setAusBubbleState('northernTerritory'); }} />
            
            {renderAusBubble('victoria')}
            {renderAusBubble('nsw')}
            {renderAusBubble('queensland')}
            {renderAusBubble('southAustralia')}
            {renderAusBubble('westernAustralia')}
            {renderAusBubble('tasmania')}
            {renderAusBubble('northernTerritory')}
          </>
        )}
      </div>
    </div>
  );
}