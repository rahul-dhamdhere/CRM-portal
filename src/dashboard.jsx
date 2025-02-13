import './dashboard.css';
import pic from './assets/watermark2.png';

function Dashboard() {
    return (
        <div id="main-bg">
            <div className='profile-card'>  
                <img id='pic' src={pic} alt="profile" />
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
            
            {/* Add your graph sections below for Lead/Client */}
        </div>
    );
}

export default Dashboard;