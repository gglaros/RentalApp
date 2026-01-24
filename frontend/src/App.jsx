import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { PropertyProvider } from "./context/PropertyContext";
import { OwnerAppProvider } from "./context/OwnerAppContext";
import { AdminProvider } from "./context/AdminContext";
import { TenantProvider } from "./context/TenantContext";
import {AdminRoutes} from "./utils/AdminRoutes";
import ReactDOM from "react-dom/client";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { LogIn } from "./pages/LogIn";
import { Profile } from "./components/profiles/Profile";
import { Logout } from "./pages/Logout";
import { PropertyForm } from "./components/PropetyForm";
import { OwnerApps } from "./components/owner/OwnerApps";
import { TenantApps } from "./components/tenant/TenantApps";
import { AllOwnerApps } from "./components/admin/AllOwnerApps";
import {AllUsers} from "./components/admin/AllUsers";
import { OwnerRequests } from "./components/owner/OwnerRequests";
import { OwnerProfile } from "./components/profiles/OwnerProfile";
import { Edit } from "./pages/Edit";
import { User } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
        <OwnerAppProvider>
          <AdminProvider>
            <TenantProvider>
            <PropertyProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/propertyform" element={<PropertyForm />} />
              <Route path="/ownerApps" element={<OwnerApps />} />
              <Route path="/ownerRequests" element={<OwnerRequests/>} />
              
              <Route element={<AdminRoutes />}>
            <Route path="/AllUsers" element={<AllUsers />} />
            <Route path="/AllOwnerApps" element={<AllOwnerApps />} />
            
            </Route>
             
              <Route path="/Edit" element={<Edit/>} />
              <Route path="/tenantApps" element={<TenantApps/>} />
              
            </Routes>
          </Layout>
        </BrowserRouter>
        </PropertyProvider>
        </TenantProvider>
        </AdminProvider>
        </OwnerAppProvider>
     
    </UserProvider>
   
  );
}

export default App;
