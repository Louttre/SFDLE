import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

//import all components
import Username from './pages/Username';
import ForgotPassword from './pages/Password';
import Profil from './pages/Profil';
import Register from './pages/Register';
import Recovery from "./pages/Recovery";
import Reset from "./pages/Reset";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import { useAuthStore } from "./store/authStore";
import ResetPassword from "./pages/ResetPassword";
import Loginsfdle from "./pages/Loginsfdle";
import Main from "./pages/Main";


const RedirectAuthUser = ({ children }) => {
    const { isAuth, user } = useAuthStore();
    if (isAuth && user.isVerified) {
        return <Navigate to='/' replace />
    }
    return children;
}
// Protected routes for authenticated users
const ProtectedRoute = ({ children }) => {
    const { isAuth, user } = useAuthStore();
    if (!isAuth || !user.isVerified) {
        return <Navigate to='/login' replace />
    }
    return children;
}
// root Routes
const router = createBrowserRouter([
    {
        path: '/',
        element: <div>Home</div>
    },
    {
        path: '/username',
        element: <Username />
    },
    {
        path: '/forgot-password',
        element: <RedirectAuthUser><ForgotPassword /></RedirectAuthUser>
    },
    {
        path:'/reset-password/:token',
        element: <RedirectAuthUser><ResetPassword /></RedirectAuthUser>
    },
    {
        path: '/recovery',
        element: <Recovery />
    },
    {
        path: '/reset',
        element: <Reset />
    },
    {
        path: '/main',
        element: <Main />
    },
    {
        path: '/profil',
        element: <ProtectedRoute><Profil /></ProtectedRoute>
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
        path: '/verify-email',
        element: <EmailVerification />
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
        <div>
                <RouterProvider router={router} />
        </div>

    );
}