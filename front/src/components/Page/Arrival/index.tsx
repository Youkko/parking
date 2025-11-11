import React from "react";
import { useUser } from '../../../contexts/User'

const Arrival: React.FC = () => {
  const { userInfo } = useUser()
  return (
    <>
      {userInfo ? (
        <>Arrival page here!</>
      ) : (
        <>You must be authenticated to access this area.</>
      )}
    </>
  );
};

export default Arrival;