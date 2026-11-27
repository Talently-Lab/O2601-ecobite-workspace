import dashboardImage from '../../../assets/dashboard-placeholder.jpg'
import './Dashboard.css'

function Dashboard(){
    return(
        <>
            <img src={dashboardImage}
      alt="Vista previa del dashboard" className="dashboard-image" />
        </>
    )
}

export default Dashboard;
