import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page'
import Home from './pages/Home'
import Mine from './pages/Mine'
import WalletApp from './pages/WalletApp'
import Layout from './layout'

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
        path: '/task',
        element: <WalletApp />,
      },
    ],
  },
])

const Route = () => {
  return <RouterProvider router={router} />
}

export default Route
