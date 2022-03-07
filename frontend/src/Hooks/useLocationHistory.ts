import { useHistory, useLocation } from 'react-router-dom';

export default function useLocationHistory() {
  const location = useLocation();
  const uri = location.pathname.split('/');
  const currentResource = '/' + uri[2];
  const endpoint = uri[uri.length - 1];
    
  const history = useHistory();
  return {
    location,
    uri,
    currentResource,
    endpoint,
    history,
  };
}
