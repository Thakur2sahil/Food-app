import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Usernav from './component/Usernav';
import Footer from './component/Footer';

function Layout() {


    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden">
            <Usernav  /> {/* Pass counter and setCounter */}
            <div className="flex-grow w-full overflow-y-auto">
                <Outlet /> {/* Provide setCounter to Outlet */}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
