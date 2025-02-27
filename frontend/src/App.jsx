import "./App.css";

import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./component/Login";
import Registration from "./component/Registration";
import NewProduct from "./component/NewProduct";
import OurProduct from "./component/OurProduct";
import About from "./component/About";
import Contact from "./component/Contact";
import Updateproduct from "./component/Updateproduct";
import Cart from "./component/Cart";
import PlaceOrder from "./component/PlaceOrder";
import AdminRoute from "./AdminRoute";
import UpdateProfile from "./component/UpdateProfile";
import DeleteProduct from "./component/DeleteProduct";
import ProductUpdate from "./component/ProductUpdate";
import OrderCard from "./component/OrderCard";
import OrderRequest from "./component/OrderRequest";
import PurchaseHistory from "./component/PurchaseHistory";
import UserDashboard from "./component/UserDashboard";
import AdminHome from "./component/AdminHome";
import UserRequest from "./component/UserRequest";
import UpdateUserProfile from "./component/UpdateUserProfile";
import ResetPassword from "./component/ResetPassword";
import Layout from "./layout";
import AdminDashBoard from "./component/AdminDashBoard";
import Download from "./component/Download";
import ProductRating from "./component/ProductRating";

const App = () => {
  const roll = localStorage.getItem("roll");

  const router = createBrowserRouter([
    {
      path: "/reset",
      element: <ResetPassword />,
    },
    {
      path: "/user/userhome",
      element: <UserDashboard />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Registration />,
    },
    {
      path: "/admin/newproduct",
      element: <AdminDashBoard />,
    },

    {
      path: "/admin",
      element: <AdminRoute />,
      children: [
        {
          path: "/admin/adminhome",
          element: <AdminHome />,
        },
        {
          path: "/admin/ourproduct",
          element: <OurProduct />,
        },
        {
          path: "/admin/updateproduct",
          element: <Updateproduct />,
        },
        {
          path: "/admin/updateprofile",
          element: <UpdateProfile />,
        },

        {
          path: "/admin/productupdate",
          element: <ProductUpdate />,
        },
        {
          path: "/admin/reset",
          element: <ResetPassword />,
        },
        {
          path: "/admin/deleteproduct",
          element: <DeleteProduct />,
        },
        {
          path: "/admin/orderrequest",
          element: <OrderRequest />,
        },
        {
          path: "/admin/userrequest",
          element: <UserRequest />,
        },
        {
          path: "/admin/downloadpdf",
          element: <Download />,
        },
        {
          path: "/admin/productrating",
          element: <ProductRating />,
        },
      ],
    },
    {
      path: "/user",
      element: <Layout />,
      children: [
        {
          path: "/user/cart",
          element: <Cart />,
        },
        {
          path: "/user/contact",
          element: <Contact />,
        },
        {
          path: "/user/about",
          element: <About />,
        },
        {
          path: "/user/ordercard",
          element: <OrderCard />,
        },
        {
          path: "/user/purchasehistory",
          element: <PurchaseHistory />,
        },
        {
          path: "/user/userupdateprofile",
          element: <UpdateUserProfile />,
        },
        {
          path: "/user/reset",
          element: <ResetPassword />,
        },

        {
          path: "/user/placeorder",
          element: <PlaceOrder />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
