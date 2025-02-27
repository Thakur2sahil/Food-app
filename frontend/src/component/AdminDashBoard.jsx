import React from 'react'
import AdminNav from './AdminNav'
import UpdateProfile from './UpdateProfile'
import NewProduct from './NewProduct'
import Sidebar from './Sidebar'

function AdminDashBoard() {



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
                <NewProduct />
            </div>
        </div>
    </div>
    
    )
}

export default AdminDashBoard
