import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Switch, Redirect, Route } from 'react-router-dom';
import Admin from './Components/Admin/Admin';
import BackdropProgress from './Components/Backdrop/BackdropProgress';
import Login from './Components/User/Login';
import useAuth from './Hooks/useAuth';
import FullPage from './Layouts/FullPage';
import { theme } from './Theme/Theme';

export default function App() {
  const auth = useAuth();
  const user = auth?.user;
  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticating = auth?.isAuthenticating;

  // While useAuth Hook is checking if Token is Valid display backdrop
  if (isAuthenticating) {
    return <BackdropProgress />;
  } else {
    return (
      <ThemeProvider theme={theme}>
        {/* Provides Date/Time Localization Library */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Switch>
            <Route path='/login'>
              {user ? (
                <Redirect to='/admin' />
              ) : (
                <FullPage>
                  <Login />
                </FullPage>
              )}
            </Route>
            <Route exact path='/'>
              {/* If user is authenticated, check if it is ADMIN or USER and direct to pertinent page, else redirect to login  */}
              {user ? (isAdmin ? <Redirect to='/admin' />: <Redirect to='/admin/invoices' /> ) : <Redirect to='/login' />}
            </Route>
            <Route path='/admin'>{user ? <Admin /> : <Redirect to='/login' />}</Route>
          </Switch>
        </LocalizationProvider>
      </ThemeProvider>
    );
  }
}
