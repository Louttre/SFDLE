import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';  // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toastify styles

//import all components
import { useAuthStore } from "./store/authStore";
import Register from './pages/Register';
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import Loginsfdle from "./pages/Loginsfdle";
import Main from "./pages/Main";
import WillItKill from "./pages/WillItKill";
import Emoji from "./pages/Emoji";
import BlindTest from "./pages/BlindTest";
import MainGame from "./pages/MainGame";
import ForgotPassword from "./pages/ForgotPassword";
import Achievements from "./pages/Achievements";
import SideMenu from "./components/SideMenu";
import TestPage from "./pages/TestPage";

const RedirectAuthUser = ({ children }) => {
    const { isAuth, user } = useAuthStore();
    if (isAuth && user.isVerified) {
        return <Navigate to='/main' replace />
    }
    return children;
}
// Protected routes for authenticated users
const ProtectedRoute = ({ children }) => {
    const { isAuth, user } = useAuthStore();

    // Add clear logs to check each step
    console.log('ProtectedRoute Executed');
    console.log('Auth Check:', { isAuth, user, isVerified: user?.isVerified });

    if (!isAuth) {
        console.log('Not authenticated, redirecting to /login');
        return <Navigate to='/login' replace />;
    }

    if (!user) {
        console.log('No user found, redirecting to /login');
        return <Navigate to='/login' replace />;
    }

    if (!user.isVerified) {
        console.log('User not verified, redirecting to /login');
        return <Navigate to='/login' replace />;
    }

    console.log('Access granted to protected route');
    return children;
};

const LayoutWithSidebar = ({ children }) => {
    return (
        <div>
            <SideMenu /> {/* Sidebar will always be visible here */}
            <div>{children}</div> {/* Render the page content */}
        </div>
    );
};

// root Routes
const router = createBrowserRouter([
    {
        path: '/',
        element: <TestPage/>
    },
    {
        path: '/reset-password/:token',
        element: <RedirectAuthUser><ResetPassword /></RedirectAuthUser>
    },
    {
        path: '/main',
        element: <LayoutWithSidebar><Main /></LayoutWithSidebar>
    },
    {
        path: '/achievements',
        element: <ProtectedRoute><Achievements /></ProtectedRoute>
    },
    {
        path: '/register',
        element: <RedirectAuthUser><Register /></RedirectAuthUser>
    },
    {
        path: '/login',
        element: <RedirectAuthUser><Login /></RedirectAuthUser>
    },
    {
        path: '/loginsfdle',
        element: <RedirectAuthUser><Loginsfdle /></RedirectAuthUser>
    },
    {
        path: '/main-game',
        element: <LayoutWithSidebar><MainGame /></LayoutWithSidebar>
    },
    {
        path: '/willitkill',
        element: <LayoutWithSidebar><WillItKill /></LayoutWithSidebar>
    },
    {
        path: '/emoji',
        element: <LayoutWithSidebar><Emoji /></LayoutWithSidebar>
    },
    {
        path: '/blind-test',
        element: <LayoutWithSidebar><BlindTest /></LayoutWithSidebar>
    },
    {
        path: '/silouhette',
        element: <Loginsfdle />
    },
    {
        path: '/verify-email',
        element: <EmailVerification />
    },
    {
        path: '/forgot-password',
        element: <RedirectAuthUser><ForgotPassword /></RedirectAuthUser>
    },
    {
        path: '*',
        element: <PageNotFound />
    },
]);




export default function App() {

    const { checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <div className="background-img">
            <div className="background-container">
                <div>
                    <RouterProvider router={router} />
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}