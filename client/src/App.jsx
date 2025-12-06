import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import VendorList from './pages/VendorList';
import RFPDetails from './pages/RFPDetails';
import InboxPage from './pages/Inbox';
import RFPList from './pages/RFPList';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rfps" element={<RFPList />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/create" element={<CreateRFP />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/rfp/:id" element={<RFPDetails />} />
      </Routes>
    </Layout>
  )
}

export default App
