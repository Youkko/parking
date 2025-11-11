import React from "react";
import { useUser } from '../../../contexts/User'

const Departure: React.FC = () => {
  const { userInfo } = useUser()
  return (
    <>
      {userInfo ? (
        <>Departure page here!</>
      ) : (
        <>You must be authenticated to access this area.</>
      )}
    </>
  );
};

export default Departure;