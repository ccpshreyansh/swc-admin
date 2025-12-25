import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFirebaseConfig } from "./context/FirebaseContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CategoryPage from "./pages/category/CategoryPage";
import Product from "./pages/products/Product";
import Investment from "./pages/investments/Investment";
import NewProduct from "./pages/products/NewProduct";
import InvestmentUser from "./pages/investments/InvestmentUser";
import UserList from "./pages/UserList";
import PartnerEarning from "./pages/PartnerEarning";
// import ProductPage from "./pages/product/ProductPage";
// import InvestmentPage from "./pages/investment/InvestmentPage";
// import UsersPage from "./pages/users/UsersPage";

function App() {
  const { shopConfig } = useFirebaseConfig();

  if (!shopConfig) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/products" element={<Product />} />
          <Route path="/newProduct" element={<NewProduct />} />
        <Route path="/investment" element={<Investment />} />
          <Route path="/investment-users" element={<InvestmentUser />} />
        <Route path="/users" element={<UserList />} />
         <Route path="/partners" element={<PartnerEarning />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
