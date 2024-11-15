import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page'
import Home from './pages/Home'
import Mine from './pages/Mine'
import Layout from './layout'
import Tasks from './pages/Tasks'
import Invites from './pages/Invites'
import Leaderboard from './pages/Leaderboard'
import Store from './pages/Store'
import WalletApp from './pages/WalletApp'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/mine',
        element: <Mine />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/invites',
        element: <Invites />,
      },
      {
        path: '/leaderboard',
        element: <Leaderboard />,
      },
      {
        path: '/store',
        element: <Store />,
      },
    ],
  },
  {
    path: '/wallet',
    element: <WalletApp />,
  },
])

const Route = () => {
  return <RouterProvider router={router} />
}

export default Route
