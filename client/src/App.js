import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import FloatingShape from "./components/FloatingShape";

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
        path: '/verify-email',
        element: <EmailVerification />
    },
    {
        path: '*',
        element: <PageNotFound />
    },
]);




export default function App() {
    
    const { isCheckingAuth, checkAuth, isAuth, user } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    console.log('isCheckingAuth', isCheckingAuth);
    console.log('isAuth', isAuth);
    console.log('user', user);
    return (
        <div>
            <div className='min-h-screen bg-gradient-to-br
        bg-gradient-to-br from-black from-0% via-slate-900 to-cyan-900 to-100% flex items-center justify-center relative overflow-hidden'
            >
                <FloatingShape color='bg-teal-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                <FloatingShape color='bg-white' size='w-48 h-48' top='70%' left='80%' delay={5} />
                <FloatingShape color='bg-gray-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                <RouterProvider router={router} />
            </div>
        </div>
    );
}