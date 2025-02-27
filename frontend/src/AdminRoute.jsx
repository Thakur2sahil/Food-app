import React from 'react';

import { Outlet } from 'react-router-dom';
import AdminNav from './component/AdminNav';
import Sidebar from './component/Sidebar';


function AdminRoute() {
    return (
      
        <div className="flex h-screen">
            {/* Sidebar fixed on the left */}
            <div className="w-1/4 h-full fixed top-0 left-0">
             <Sidebar/>
            </div>

            {/* Main content area, scrollable and occupying full width */}
            <div className=" w-full h-full flex flex-col  ">
                <div className='p-0 m-0'>
                    <AdminNav />
                </div>
                <div className=" pl-60 pt-0 overflow-auto"> {/* Increased margin here for more spacing */}
                    <Outlet />
                </div>
            </div>
        </div>
        
    );
}

export default AdminRoute;
