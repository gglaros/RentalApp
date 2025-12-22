import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { PropertyProvider } from "./context/PropertyContext";
import { OwnerAppProvider } from "./context/OwnerAppContext";
import { AdminProvider } from "./context/AdminContext";
import ReactDOM from "react-dom/client";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { LogIn } from "./pages/LogIn";
import { Profile } from "./components/profiles/Profile";
import { Logout } from "./pages/Logout";
import { PropertyForm } from "./components/PropetyForm";
import { OwnerApps } from "./components/users/OwnerApps";
import { OwnerProfile } from "./components/profiles/OwnerProfile";
import { User } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <PropertyProvider>
        <OwnerAppProvider>
          <AdminProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/propertyform" element={<PropertyForm />} />
              <Route path="/ownerApps" element={<OwnerApps />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        </AdminProvider>
        </OwnerAppProvider>
      </PropertyProvider>
    </UserProvider>
  );
}

export default App;
