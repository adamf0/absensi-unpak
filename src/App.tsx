import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticateRoutes from './component/AuthenticateRoutes';
import BlockAfterAuthenticateRoutes from './component/BlockAfterAuthenticateRoutes';
import Home from './page/Home';
import Absensi from './page/Absensi';
import Cuti from './page/Cuti';
import Login from './page/Login';
import Logout from './page/Logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/absensi" element={
          <AuthenticateRoutes>
              <Absensi />
          </AuthenticateRoutes>
        } />
        <Route path="/cuti" element={
          <AuthenticateRoutes>
            <Cuti />
          </AuthenticateRoutes>
        } />
        <Route path="/login" element={
          <BlockAfterAuthenticateRoutes>
            <Login />
          </BlockAfterAuthenticateRoutes>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  )
}

export default App
