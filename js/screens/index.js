/**
 * Imports all screens
 */

import ForgotPassword from './login/forgot-password';
import GatewaySetup from './gateway-setup';
import LoginScreen from './login/login-screen';
import CreateName from './login/create-name';
import CreateEmail from './login/create-email';
import SensorSetup from './sensor-setup';
import Status from './status-screen';
import Alerts from './alerts';
import SensorMap from './sensor-map';
import Splash from './splash';

export default SCREENS = {
    ForgotPassword: ForgotPassword,
    GatewaySetup: GatewaySetup,
    LoginScreen: LoginScreen,
    SensorSetup: SensorSetup,
    Status: Status,
    Alerts: Alerts,
    SensorMap: SensorMap,
    CreateName: CreateName,
    CreateEmail: CreateEmail,
    Splash : Splash
}
