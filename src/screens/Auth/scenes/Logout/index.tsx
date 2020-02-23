import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

interface LogoutProp {
  onLogoutUser(): void;
}

export const Logout = (props: LogoutProp) => {
  const { onLogoutUser } = props;

  useEffect(() => {
    onLogoutUser();
  }, [onLogoutUser]);

  return (
    <div>
      <Helmet>
        <title>MetaGenScope :: Logged Out</title>
      </Helmet>
      <p>
        You are now logged out. Click <Link to="/login">here</Link> to log back
        in.
      </p>
    </div>
  );
};

export default Logout;
