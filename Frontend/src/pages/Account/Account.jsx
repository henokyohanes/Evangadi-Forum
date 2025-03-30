import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AppState } from "../../Routes/Router";
import Layout from "../../Components/Layout/Layout";
import ProfileImage from "../../Components/ProfileImage/ProfileImage";

const Account = () => {
  const { user, handleLogout } = useContext(AppState);

  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <Layout>
      <div>
        <ProfileImage />
        <div><p>username</p><p>{user.username}</p></div>
        <div><p>name</p><p>{user.firstname} {user.lastname}</p></div>
        <div><p>email</p><p>{user.email}</p></div>
        <div onClick={onLogoutClick}> <FontAwesomeIcon icon={faSignOutAlt} />LOgout
        </div>
      </div>
    </Layout>
  );
};

export default Account;
