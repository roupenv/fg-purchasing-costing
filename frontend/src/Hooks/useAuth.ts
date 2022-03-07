
// Hook for child components to get the auth object
import { useContext } from "react";
import { UserContext } from "./AuthProvider";

export default function useAuth(){
  return useContext(UserContext);
};