import React, {useState} from 'react'
import "./Sidebar.css"

const Sidebar =() => {
    const [isExpanded, setExpendState] = useState(false);
    const menuItem=[
        {
            path:"/",
            text:"Dashboard",
            icon:"img/dashboard_icon.png"
            
        },
        {
            path:"/",
            text:"Inbox",
            icon:"img/inbox_icon.png"
        },
        {
            path:"/",
            text:"Studio",
            icon:"img/studio_icon.png"
        },
        {
            path:"/",
            text:"Assignment",
            icon:"img/assignment_icon.png"
        },
        {
            path:"/",
            text:"Help",
            icon:"img/help_icon.png"
        }

    ]
    return(
        <div className={isExpanded ? 'side-nav-container' : "side-nav-container side-nav-container-NX"}>
            <div className="nav-upper">
                <div className="nav-heading">
                    <div className="nav-brand">
                        <img src="img/logo.png"></img>
                    </div>
                    {/* <button className='ham-menu'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button> */}
                </div>
                <div className="nav-meny">
                    {menuItem.map(({text,icon}) => (
                        <a href="#" className='menu-item'>
                            <img src={icon} alt="" srcset=""/>
                        </a>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Sidebar;