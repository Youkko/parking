import React from "react";

const isUserLoggedIn = (): boolean => {
  const loggedUser = localStorage.getItem("loggedUser");
  return loggedUser !== null;
};

const Departure: React.FC = () => {
  const logged = isUserLoggedIn();

  return (
    <>
      {logged ? (
        <>Departure page here!</>
      ) : (
        <>You must be authenticated to access this area.</>
      )}
    </>
  );
};

export default Departure;