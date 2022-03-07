// Hook for child components to get the auth object
import { useContext } from "react";
import { ResourceDetailsContext } from '../state/context';

export default function useResourceDetailsContext(){
  return useContext(ResourceDetailsContext);
};