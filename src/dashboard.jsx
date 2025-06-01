import './dashboard.css';
import pic from './assets/watermark2.png';
import LineGraph from './LineGraph'; // Fix import casing

function Dashboard() {
  // Data for the first graph (Leads by Month)
  const leadsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Leads',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Data for the second graph (Clients by Month)
  const clientsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Clients',
        data: [12, 15, 20, 25, 30, 35, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Options for Leads graph
  const leadsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Leads' },
    },
  };

  // Options for Clients graph
  const clientsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Clients' },
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
        {/* Leads Graph */}
        <div className="youtube-style-graph" style={{ width: '35%', height: '225px', margin: '5%' }}>
          <LineGraph data={leadsData} options={leadsOptions} />
        </div>
        {/* Clients Graph */}
        <div className="youtube-style-graph" style={{ width: '35%', height: '225px', margin: '5%' }}>
          <LineGraph data={clientsData} options={clientsOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;