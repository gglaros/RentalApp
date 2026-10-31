import { RequireAuth } from "../routes/RequireAuth";

export const AdminRoutes = () => <RequireAuth roles={["ADMIN"]} />;
