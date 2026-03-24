import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Home from '../pages/Home/Home.jsx'
import Search from '../pages/Search/Search.jsx'
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/search"      element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="*"            element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}
