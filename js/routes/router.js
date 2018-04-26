import { StackNavigator } from 'react-navigation';
import SCREENS from './../screens/index';

export default ROUTES = StackNavigator({
  Splash: {screen: SCREENS.Splash},
  CreateName: { screen: SCREENS.CreateName },
  CreateEmail: { screen: SCREENS.CreateEmail },
  Login: { screen: SCREENS.LoginScreen },
  ForgotPassword: { screen: SCREENS.ForgotPassword },
  GatewaySetup: { screen: SCREENS.GatewaySetup },
  SensorSetup: { screen: SCREENS.SensorSetup },
  Status: { screen: SCREENS.Status },
  Alerts: { screen: SCREENS.Alerts },
  SensorMap: { screen: SCREENS.SensorMap }
});
