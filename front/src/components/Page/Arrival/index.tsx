import React from "react";

const isUserLoggedIn = (): boolean => {
  const loggedUser = localStorage.getItem("loggedUser");
  return loggedUser !== null;
};

const Arrival: React.FC = () => {
  const logged = isUserLoggedIn();

  return (
    <>
      {logged ? (
        <>Arrival page here!</>
      ) : (
        <>You must be authenticated to access this area.</>
      )}
    </>
  );
};

export default Arrival;