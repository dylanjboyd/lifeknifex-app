import React, { useEffect } from 'react';
import { Button, Divider, Form } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Redirect, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectIsLoggingIn,
  selectLoginError,
} from '../../features/auth/authSelectors';
import { logIn } from '../../features/auth/authSlice';
import HeaderBar from '../common-components/HeaderBar';

const Login: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [usernameError, setUsernameError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const isLoggingIn = useSelector(selectIsLoggingIn);
  const loginError = useSelector(selectLoginError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const location = useLocation<LocationState>();

    type LocationState = {
      from: Location
    };

    useEffect(() => {
      if (loginError) enqueueSnackbar(loginError, { variant: 'error' });
    }, [loginError, enqueueSnackbar]);

    if (isAuthenticated) return <Redirect to={location.state?.from || { from: { pathname: '/' } }} />;

    const performLogin = async () => {
      if (isLoggingIn) return;

      setUsernameError(!username);
      setPasswordError(!password);

      if (!username || !password) {
        enqueueSnackbar('Username and password required', { variant: 'error' });
        return;
      }

      try {
        await dispatch(logIn(username, password));
      } catch (e) {
        // TODO: Handle login errors here instead of in a Snackbar
      }
    };

    return (
      <div className="login">
        <HeaderBar title="Log In" icon="account" />
        <Divider hidden />
        <Form error={!!loginError} onSubmit={performLogin} loading={isLoggingIn}>
          <Form.Field>
            <label htmlFor="username">Username</label>
            <Form.Input
              id="username"
              error={usernameError}
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">Password</label>
            <Form.Input
              id="password"
              error={passwordError}
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Field>
          <Button primary type="submit">Log in</Button>
        </Form>
      </div>
    );

  // RegistrationButton = () => this.state.isRegistrationEnabled ?
  //     <Button
  //         type='button'
  //         onClick={() => this.props.history.replace('/register')}
  //         basic
  //     >
  //         No account? Register now.
  //     </Button>
  //     : null;

  // checkRegistrationEnabled() {
  //     getFeature(this.cancelToken, API_FEATURE_REGISTRATION_ENABLED)
  //         .then(isRegistrationEnabled => this.setState({isRegistrationEnabled}));
  // }
};

export default Login;
