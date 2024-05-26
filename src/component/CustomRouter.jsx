import { RouterProvider, createBrowserRouter } from "react-router-dom"
import App from '../App';
import Auth from '../page/Auth'
import Moim from '../page/Moim'
import Write from '../page/Moim/Write'
import Account from '../page/Account'
import Specific from '../page/Moim/Specific'
import Update from '../page/Moim/Write/Update'

const CustomRouterProvider = ({ children }) => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <App />
        },
        {
            path: "/auth",
            element: <Auth />,
        },
        {
            path: "/moim",
            element: <Moim />,
        },
        {
            path: "/moim/write",
            element: <Write />
        },
        {
            path: "/moim/update/:id",
            element: <Update />
        },
        {
            path: "/moim/:id",
            element: <Specific />
        },
        {
            path: "/account",
            element: <Account />,
        },
    ]);

    return <RouterProvider router={router}>
        {children}
    </RouterProvider>
}

export default CustomRouterProvider