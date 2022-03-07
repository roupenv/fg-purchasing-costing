import { Redirect, Route } from "react-router-dom";
import useAuth from "./useAuth";

export default function PrivateRoute({ children, ...rest }: any) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={() =>
      // If user info exists then render children, else render Redirect to login
        auth?.user?.role === 'ADMIN' ? (
          children
        ) : (
          <Redirect to='/admin/unauthorized'/>
        )
      }
    />
  );
}
