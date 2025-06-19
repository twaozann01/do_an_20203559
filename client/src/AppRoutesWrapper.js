import { useRoutes } from "react-router-dom";
import appRoutes from "./routes";

const AppRoutesWrapper = () => {
  const routes = useRoutes(appRoutes);
  return routes || null;
};

export default AppRoutesWrapper;
