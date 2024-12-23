import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page'
import Layout from './layout'
import Waitlist from './pages/Waitlist'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Waitlist />,
      },
    ],
  },
])

const Route = () => {
  return <RouterProvider router={router} />
}

export default Route
