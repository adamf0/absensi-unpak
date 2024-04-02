import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticateRoutes from './component/AuthenticateRoutes';
import BlockAfterAuthenticateRoutes from './component/BlockAfterAuthenticateRoutes';
import HomePage from './page/HomePage';
import AbsensiPage from './page/AbsensiPage';
import CutiPage from './page/CutiPage';
import LoginPage from './page/LoginPage';
import LogoutPage from './page/LogoutPage';
import IzinPage from './page/IzinPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/absensi" element={
          <AuthenticateRoutes>
              <AbsensiPage />
          </AuthenticateRoutes>
        } />
        <Route path="/cuti" element={
          <AuthenticateRoutes>
            <CutiPage />
          </AuthenticateRoutes>
        } />
        <Route path="/izin" element={
          <AuthenticateRoutes>
            <IzinPage />
          </AuthenticateRoutes>
        } />
        <Route path="/login" element={
          <BlockAfterAuthenticateRoutes>
            <LoginPage />
          </BlockAfterAuthenticateRoutes>} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  )
}

export default App
