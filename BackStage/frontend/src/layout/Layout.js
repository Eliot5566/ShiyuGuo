import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { useState } from 'react';

const Layout = () => {
    const [toggle, setToggle] = useState(false);
    function Toggle(){
        setToggle(!toggle);
    }

    return (
        <main className="d-flex">
            <div className={toggle ? "d-none" : "w-auto position-fixed"}>
                <SideBar/>
            </div>
            <div className={toggle ? "d-none" : "invisible"}>
                <SideBar/>
            </div>
            <div className="col">
                <Navbar Toggle={Toggle}/>
                <Outlet/>
            </div>
        </main>
    )
}

export default Layout
