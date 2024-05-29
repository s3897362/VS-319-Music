import React from "react";
import "./Dashboard.css"
import Sidebar from "../components/Sidebar/Sidebar";

const Dashboard = () => {
    return(
        <div>
            <Sidebar/>
            <div className="dashboard">
                Dashboard
            </div>
        </div>

    )
}

export default Dashboard;