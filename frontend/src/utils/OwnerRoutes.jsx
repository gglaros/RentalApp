import { RequireAuth } from "../routes/RequireAuth";

export const OwnerRoutes = () => <RequireAuth roles={["OWNER"]} />;
