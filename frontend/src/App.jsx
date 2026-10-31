import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { PropertyProvider } from "./context/PropertyContext";
import { OwnerAppProvider } from "./context/OwnerAppContext";
import { AdminProvider } from "./context/AdminContext";
import { TenantProvider } from "./context/TenantContext";
import { RequireAuth, GuestOnly } from "./routes/RequireAuth";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { LogIn } from "./pages/LogIn";
import { Profile } from "./components/profiles/Profile";
import { Logout } from "./pages/Logout";
import { PropertyForm } from "./components/PropetyForm";
import { PropertyDetails } from "./PropertyDetails";
import { OwnerApps } from "./components/owner/OwnerApps";
import { TenantApps } from "./components/tenant/TenantApps";
import { AllOwnerApps } from "./components/admin/AllOwnerApps";
import {AllUsers} from "./components/admin/AllUsers";
import { PendingImages } from "./components/admin/PendingImages";
import { OwnerRequests } from "./components/owner/OwnerRequests";
import { Edit } from "./pages/Edit";
import { EditProperty } from "./pages/EditProperty";
import { Properties } from "./pages/Properties";
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

              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/logout" element={<Logout />} />

              <Route element={<GuestOnly />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<LogIn />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/Edit" element={<Edit />} />
              </Route>

              <Route element={<RequireAuth roles={["OWNER"]} />}>
                <Route path="/propertyform" element={<PropertyForm />} />
                <Route path="/property/:id/edit" element={<EditProperty />} />
                <Route path="/ownerApps" element={<OwnerApps />} />
                <Route path="/ownerRequests" element={<OwnerRequests />} />
              </Route>

              <Route element={<RequireAuth roles={["TENANT"]} />}>
                <Route path="/tenantApps" element={<TenantApps />} />
              </Route>

              <Route element={<RequireAuth roles={["ADMIN"]} />}>
                <Route path="/AllUsers" element={<AllUsers />} />
                <Route path="/AllOwnerApps" element={<AllOwnerApps />} />
                <Route path="/PendingImages" element={<PendingImages />} />
              </Route>

              <Route path="*" element={<Home />} />
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

