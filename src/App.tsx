import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AuthPage from './pages/AuthPage';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import Account from './pages/Account';
import { StoreSettingsProvider } from './hooks/useStoreSettings';

// Simple placeholder pages
const AdminDashboard = () => <div className="py-10 text-2xl font-serif text-brand-chocolate">Bienvenida al Dashboard Administrativo</div>;

function App() {
  return (
    <StoreSettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="producto/:slug" element={<ProductDetail />} />
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="registro" element={<AuthPage mode="register" />} />
            <Route path="ofertas" element={<Catalog key="offers" collection="offers" />} />
            <Route path="nuevos" element={<Catalog key="new" collection="new" />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="cuenta" element={<Account />} />
            <Route path="contacto" element={<Contact />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </StoreSettingsProvider>
  );
}

export default App;
