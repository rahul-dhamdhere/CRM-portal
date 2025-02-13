import './dashboard.css';
import pic from './assets/watermark2.png';
import LineGraph from './Linegraph';
function Dashboard() {
  // Data for the first graph (e.g., Leads by Month)
  const leadsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Leads',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the second graph (e.g., Clients by Status)
  const clientsData = {
    labels: ['Active', 'Inactive', 'Pending'],
    datasets: [
      {
        label: 'Clients',
        data: [12, 5, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the graphs
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Leads',
      },
    },
  };

  return (
    <div id="main-bg">
      <div className="profile-card">
        <img id="pic" src={pic} alt="profile" />
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">Rahul Dhamdhere</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className="detail-value">Software Developer Intern</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Employee ID:</span>
            <span className="detail-value">40</span>
          </div>
        </div>
      </div>
    <div style={{display : 'flex', justifyContent: 'space-between'}}>
      {/* Add graphs here */}
      <div className="youtube-style-graph" style={{ width: '40%', height: '300px',margin : '5%'}}>
        <LineGraph />
      </div>
      <div className="youtube-style-graph" style={{ width: '40%', height: '300px',margin : '5%'}}>
        <LineGraph />
      </div>
      </div>
    </div>
    
  );
}

export default Dashboard;