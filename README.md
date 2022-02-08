# Deprecated.

### Please visit [mydevices.com](https://mydevices.com) and our [docs](https://docs.mydevices.com) page for more information and new APIs on how to build applications with myDevices. 


---



#### Cayenne Cloud API Sample App

This repo contains a sample app walking through the Authentication process along with device pre-provisioning. 

---

## Prereqs
1. Run `npm install` in root
2. This app was built using React Native and a getting start guide can be found [here] (https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) which will be needed to run the app simulation
    - Use your preferred React Native IDE (I used [Visual Studio Code](https://code.visualstudio.com/) with React Native Tools plugin)
3. Create or log into your Cayenne account at https://cayenne.mydevices.com/cayenne/login
4. Obtain  your Cayenne Cloud API app key and secret by clicking the Create App button.
5. Create an `.env` file using the `.env.example` file and input your app key/secret values
    * Note, when making changes to `.env`, please edit `js/config/settings.js` with any blank line/whitespace as per react-native-dotenv [Troubleshooting](https://github.com/zetachang/react-native-dotenv#troubleshooting)
6. You should now be able to run the Sample App and land on the login screen (implicit/explicit logins will not work at this point)
    - You can run the app simulation by using `react-native run-ios` or `react-native run-android` 

### Example Walkthrough

In this section we will cover practical examples of putting the Cayenne Cloud API into use.

The example walkthrough shown here is arranged as a narrative that walks you through the various API-related topics required to implement each screen found in the **Cayenne API Sample App**. You can find more information about the Cayenne Cloud API [here](http://mdswp-staging.mydevices.com/cayenne/docs/#cayenne-api)

1. **[Application redirects](#application-redirects)** - Application Redirects.
2. **[Creating an account](#creating-an-account)** - Creating a new account.
3. **[Logging into an account](#logging-into-account)** - Log into our account.
4. **[Resetting password](#reset-password)** - Resetting the account password.
5. **[Provisioning devices](#provisioning-devices)** - Provisioning a device so that it can be later activated.
6. **[Activating devices](#activating-a-device)** - Activating devices.
7. **[Get real-time device data](#getting-real-time-device-data)** - Fetching device status and current device data.
8. **[Remote control](#remote-control)** - Controlling devices remotely.
9. **[Device History](#getting-device-history)** - Fetching historical device data.
10. **[Alerts](#alerts)** - Creating and managing Alerts.
11. **[Multi-Tenant](#multi-tenant)** - Creating and managing Users.

#### Application Redirects

Your appplication redirects will be used to retrieve an oAuth token using your **App Key** and **App Secret**. 

First you must retrieve an authorization token to modify your application which is done by making a `POST` to `https://auth.mydevices.com/oauth/token` with the following payload:
```
{
	"grant_type": "password",
	"email": "YOUR EMAIL",
	"password": "YOUR PASSWORD
}
```

Example `POST` curl call:
`curl -X POST -H 'Content-Type: application/json' 'https://auth.mydevices.com/oauth/token' -d '{"grant_type": "password", "email": "YOUR EMAIL", "password": "YOUR PASSWORD"}'`

A successful response will return the following:
```
{
	"access_token": "YOUR AUTH TOKEN",
	"refresh_token": "YOUR REFRESH TOKEN"
}
```

Using your `access_token` from successful `oauth/token` POST, you can view all your applications for your account by making a `GET` to `https://auth.mydevices.com/applications`

Example `GET` curl call:
`curl -X GET -H 'Authorization: Bearer ACCESS_TOKEN' 'https://auth.mydevices.com/applications'`

A successful response will return with the following:
```
{
	"id": "YOUR APP ID",
	"name": "Beta App",
	"description": "This is a beta app created with Cayenne API",
	"secret": "YOUR APP SECRET",
	"status": "active",
	"updated_at": "YYYY-MM-DDTHH:MM:SS.mmmZ",
	"created_at": "YYYY-MM-DDTHH:MM:SS.mmmZ"
}
```

Note: Your application's name and description will currently have default values during Beta phase. 

To update your application's `redirect_uri`, you will need to make a `POST` to `https://auth.mydevices.com/applications/{YOUR APP ID}/redirects` with the following payload:
```
{
	"redirect_uri": "YOUR REDIRECT URI"
}
```

Example curl call using the sample app's redirect URI.
`curl -X POST -H 'Authorization: Bearer ACCESS_TOKEN' 'https://auth.mydevices.com/applications/{app id}/redirects' -d '{"redirect_uri": "sample://implicit"}'`

This should be repeated for `redirect_uri: sample://explicit` as `sample://explicit` and `sample://implicit` are redirects that will be used by the sample app on oAuth login. 

It is also recommended to add `http://example.com/redirect` as an additional redirect URI for **[Logging into an account](#logging-into-account)**. 

#### Creating an account

In order to use the Cayenne Sample App, users are reqired to have an account. If they do not already have an account, they can create one directly from the app. To begin, the user is asked to provide the necessary account information used to create the new account.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524163604/Tank-Monitoring-Create-account2.png" width="346" height="615" alt="Sample App Create Account 1"><br/><br/></p>

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524163607/Tank-Monitoring-Create-account3.png" width="346" height="615" alt="Sample App Create Account 2"><br/><br/></p>

Once we have the information from the user, we can use the Cayenne Cloud API to create a new account. If the account creation is successful, we can proceed with logging the user into their account.

In order to create an account, you will need to use the following endpoint: `https://auth.mydevices.com/users` with the following payload:
```
{
	"first_name": "YOUR FIRST NAME",
	"last_name": "YOUR LAST NAME",
	"email": "YOUR EMAIL",
	"password": "YOUR PASSWORD"
}
```

Example `POST` curl call:
`curl -X POST -H 'Content-Type: application/json' 'https://auth.mydevices.com/users' -d '{"first_name": "joe", "last_name": "smith", "email": "EMAIL", "password": "PASSWORD"}'`

A successful response will return the following: 
```
{
	"access_token": "YOUR AUTH TOKEN",
	"refresh_token": "YOUR REFRESH TOKEN"
}
```

#### Logging into account

Once the user has a valid account, they will need to be logged in to continue. This is handled in the sample app in one of two ways:

1. **[Log in to existing account](#logging-into-existing-account)** - Log in to a returning users account.

##### Logging into existing account

After logging out of the app, returning users will want to log into their existing account. Let's take a look at how the Cayenne Sample App and asks the user for their account credentails. We will then examine how the Cayenne Cloud API can be used to log the user into their existing account using the information provided.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524084310/Restaurant-iPhone_LogIn-1-2.png" width="346" height="615" alt="Sample App Login screen"><br/><br/></p>

The following will go over how to log into an existing account using three methods. 

1. Logging in using password grant type
This method will use your email and password used when creating your account and will return an `access_token` and `refresh_token` on success. The endpoint used is `https://auth.mydevices.com/oauth/token` with the following payload:
```
{
	"grant_type": "password",
	"email": "YOUR EMAIL",
	"password": "YOUR PASSWORD
}
```

Example `POST` curl call:
`curl -X POST -H 'Content-Type: application/json' 'https://auth.mydevices.com/users' -d '{"grant_type": "password", "email": "YOUR EMAIL", "password": "YOUR PASSWORD"}'`

A successful response will return the following: 
```
{
	"access_token": "YOUR AUTH TOKEN",
	"refresh_token": "YOUR REFRESH TOKEN"
}
```

For the following steps, we will be using `http://example.com/redirect` (must be added to your application's redirects) and using the following URL with `response_type` being `code` for explicit or `token` for implicit: 
`https://auth.mydevices.com/oauth/authorization?redirect_uri=http%3A%2F%2Fexample.com%2Fredirect&client_id=YOUR APP ID&response_type=TYPE&state=0123456789`

2. Logging in using oAuth through implicit flow using `http://example.com/redirect` (the sample app will use `sample://implicit` for implicit flow)

For implicit, you will use: `https://auth.mydevices.com/oauth/authorization?redirect_uri=http%3A%2F%2Fexample.com%2Fredirect&client_id=YOUR APP ID&response_type=token&state=0123456789`

You will be taken to a login page when accessing the url and after a successful login, you'll be redirected to `http://example.com/redirect#access_token=YOUR ACCESS TOKEN&state=0123456789`. The access_token is your oAuth token can can be used to access your application's things. For the sample app, you'll be redirected back to your app using deep linking with a redirect of `sample://implicit`.

3. Logging in using oAuth through explicit flow. Note: this is added in the sample app for demonstration purposes, it is recommended to use Implicit flow for apps and single page applications.

For explicit, you will use: `https://auth.mydevices.com/oauth/authorization?redirect_uri=http%3A%2F%2Fexample.com%2Fredirect&client_id=YOUR APP ID&response_type=code&state=0123456789`

After a successful login, you'll be redirected to `http://example.com/redirect?code=YOUR CODE&state=0123456789`
With the code provided you can make a `POST` to `https://auth.mydevices.com/oauth/token` with the following payload:
```
{
	"client_id": "YOUR APP KEY",
	"client_secret": "YOUR APP SECRET",
	"code": "CODE FROM URL",
	"grant_type": "authorization_code",
	"redirect_uri": "http://example.com/redirect"
}
```

Example curl call:
`curl -X POST 'https://auth.mydevices.com/oauth/token' -d '{ "client_id": "YOUR APP KEY", "client_secret": "YOUR APP SECRET", "code": "CODE FROM URL", "grant_type": "authorization_code", "redirect_uri": "http://example.com/redirect"}'`

Successful response will return the following:
```
{
	"acess_token": "YOUR oAUTH TOKEN",
	"refresh_token": "YOUR REFRESH TOKEN"
}
```

Within the sample app, you'll also be redirected to your app using deep linking with a redirect of `sample://explicit` and will make a post to `oauth/token` with the returned code. 

#### Reset Password

In the event that a user has forgotten their password, the Cayenne Cloud API can be used to reset the password. Let's take a look at the Cayenne Sample App and examine how it deals with this scenario.

**Generate password reset email**

In order to reset the user's password, we first need to know the users login information. After providing this information, we can use the Cayenne Cloud API to generate and send an email containing a password reset link.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524083818/Restaurant-iPhone_LogIn-1-3.png" width="346" height="615" alt="Sample App Forgot password screen"><br/><br/></p>

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524164225/Tank-Monitoring-Reset-Password.png" width="346" height="615" alt="Sample App Password reset email confirmation"><br/><br/></p>

In order to send a reset password link to your account's email, make a `POST` to `https://auth.mydevices.com/password/forgot` with the following payload:

```
{
	"email": "YOUR EMAIL"
}
```

Example curl call:
`curl -X POST 'https://auth.mydevices.com/password/forgot' -d '{"email": "YOUR EMAIL"}'`

Successful response will return `{ "success": true }`. You will receive an email shortly after the POST. 

#### Device Types

Before preprovisioning a device, you must first add device types to your application which is done by using the oAuth token in step 2 or 3 of [Logging into existing account](#logging-into-existing-account). 

To add a device type to your application, issue a `POST` to `https://platform.mydevices.com/v1.1/things/types` with the following example gateway payload:
```
{
    "name": "My Gateway",
    "description": "A sample gateway",
    "version": "v1.0",
    "manufacturer": "Example Inc.",
    "parent_constraint": "NOT_ALLOWED",
    "child_constraint": "ALLOWED",
    "category": "module",
    "subcategory": "sample",
    "transport_protocol": "someprotocol"
}
```

And with an example sensor payload:
```
{
    "name": "My Sensor",
    "description": "A sample sensor",
    "version": "v1.0",
    "manufacturer": "Example Inc.",
    "parent_constraint": "ALLOWED",
    "child_constraint": "ALLOWED",
    "category": "sensor",
    "subcategory": "sample",
    "transport_protocol": "someprotocol"
}
```

Example curl call:
`curl -X POST -H 'Authorization: Bearer OAUTH_TOKEN_HERE' 'https://platform.mydevices.com/v1.1/things/types -d '{"name": "My Gateway", "description": "A sample gateway", "version": "v1.0", "manufacturer": "Example Inc.", "parent_constraint": "NOT_ALLOWED", "child_constraint": "ALLOWED", "category": "module", "subcategory": "sample", "transport_protocol": "someprotocol"}'`

Succesful response will return the following:
```
{
	"id": "DEVICE TYPE ID",
	"created_at": "2017-08-08T23:51:00.000Z",
	"updated_at": "2017-08-08T23:51:00.000Z",
	"name": "My Gateway",
	"description": "A sample gateway",
	"version": "v1.0",
	"manufacturer": "Example Inc.",
	"parent_constraint": "NOT_ALLOWED",
	"child_constraint": "ALLOWED",
	"category": "module",
	"subcategory": "sample",
	"transport_protocol": "someprotocol"
}
```

The "id" value in payload response is your device_type_id which will be used in the next section, [Provisioning Devices](#provisioning-devices).

You may also view a list of all your device types by issuing a `GET` to `https://platform.mydevices.com/v1.1/things/types` with a header of `Authorization: Bearer OAUTH_TOKEN`.

#### Provisioning Devices

Before a device can be activated using the Cayenne Cloud API, it must first be provisioned. Provisioning a device prepares the Cayenne backend to activate the device and generates the **Hardware IDs** that are required during the [Device Activation](#activating-a-device) process.

Let's provision an example Gateway, Sensor and Actuator which we will continue to use throughout the rest of our examples. The Cayenne Cloud API provides different ways for us to provision these devices.

- **[Provision devices one at a time](#provision-single-devices)** - How to provision devices one at a time.
- **[Bulk provision the devices](#bulk-provisioning-devices)** - How to provision multiple devices at once.

##### Provision single Devices

Devices can be provisioned one at a time, allowing for tasks such as one-off or on demand provisioning of devices. Let's examine using the Cayenne Cloud API to provision our example devices, one at a time.

We will be issuing a `POST` to `https://platform.mydevices.com/v1.1/things/registry` with a `Authorization: Bearer OAUTH_TOKEN` header and the following example payload:

```
{
  "codec": "some codec",
  "hardware_id": "YOUR CHOSEN UNIQUE HARDARE ID",
  "device_type_id": "YOUR DEVICE TYPE ID",
  "application_id": "YOUR APP KEY",
  "response_csv": false
}
```

Example curl call:
```
curl --request POST \
  --url https://platform.mydevices.com/v1.1/things/registry \
  --header 'authorization: Bearer_OAUTH TOKEN_HERE' \
  --header 'content-type: application/json' \
  --data '{
	"codec": "some codec",
  "hardware_id": "YOUR CHOSEN UNIQUE HARDARE ID",
  "device_type_id": "YOUR DEVICE TYPE ID",
  "application_id": "YOUR APP KEY",
  "response_csv": false
}'
```

Successful response will return the following payload example:
```
{
	"id": "SOME ID VALUE",
	"status": "PENDING",
	"created_at": "2017-08-09T00:04:14.000Z",
	"codec": "some codec",
	"hardware_id": "YOUR CHOSEN UNIQUE HARDARE ID",
	"device_type_id": "YOUR DEVICE TYPE ID",
	"application_id": "YOUR APP KEY"
}
```

Having done this, you are now able to add a device by using your chosen unique hardware id and this will be explained in [Activating a device](#activating-a-device).

##### Bulk Provisioning Devices

If you have multiple devices that need to be provisioned, the Cayenne Cloud API allows you to batch or bulk provision the devices. Let's provision the same devices as seen in the [Single Device](#provision-single-devices) example, only this time we'll see how they can be provisioned all at once.

**Note: There is a limit of 500 devices that can be provisioned at a time.**

We will be issuing a `POST` to `https://platform.mydevices.com/v1.1/things/registry/batch` with a `Authorization: Bearer OAUTH_TOKEN` header and the following example payload:
```
{
  "device_type_id": "YOUR DEVICE TYPE ID",
  "hardware_ids": [
    "HARDWARE ID 1",
    "HARDWARE ID 2",
    ...,
    "HARDWARE ID N"
  ],
  "count": N,
  "response_csv": false
}
```

Example curl call:
```
curl --request POST \
  --url https://platform.mydevices.com/v1.1/things/registry/batch \
  --header 'authorization: Bearer YOUR_OAUTH_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
  "device_type_id": "YOUR DEVICE TYPE ID",
  "hardware_ids": [
    "HARDWARE ID 1",
    "HARDWARE ID 2",
    ...,
    "HARDWARE ID N"
  ],
  "count": N,
  "response_csv": false
}'
```

Successful response will return the following payload:
```
[
	{
		"id": "SOME ID VALUE",
		"application_id": "APP KEY",
		"hardware_id": "HARDARE ID 1",
		"device_type_id": "YOUR DEVICE TYPE ID",
		"codec": null,
		"status": "PENDING",
		"created_at": "2017-08-08T18:25:52.000Z"
	},
	{
		"id": "SOME ID VALUE",
		"application_id": "APP KEY",
		"hardware_id": "HARDWARE ID 2",
		"device_type_id": "YOUR DEVICE TYPE ID",
		"codec": null,
		"status": "PENDING",
		"created_at": "2017-08-08T18:25:52.000Z"
	},
  ...
  {
		"id": "SOME ID VALUE",
		"application_id": "APP KEY",
		"hardware_id": "HARDWARE ID N",
		"device_type_id": "YOUR DEVICE TYPE ID",
		"codec": null,
		"status": "PENDING",
		"created_at": "2017-08-08T18:25:52.000Z"
  }
]
```

#### Activating a Device

Once a device has been provisioned, it can then be activated and added to the user's account. Let's build upon the [provisioning example](#provisioning-devices) and examine how the user can activate the example devices using the Cayenne Sample App and the Cayenne Cloud API.

Let's begin by seeing how a Gateway device is activated. After selecting to add a Gateway device, the user is asked for device information needed to activate the gateway. After entering in the information, the Cayenne Cloud API can be used to activate the device.

*NOTE: Notice how the user is asked for the __Gateway ID__ during the activation process. This ID is the __Hardware ID__ generated earlier during the device provisioning step.*

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524084436/Restaurant-iPhone_AddGateway-1-2.png" width="346" height="615" alt="Sample App Add Gateway screen"><br/><br/></p>

To add a gateway using the hardware id, we will issue a `POST` to `https://platform.mydevices.com/v1.1/things/pair` with a `Authorization: Bearer OAUTH_TOKEN` header and the following example payload:
```
{
  "hardware_id": "YOUR HARDARE ID",
  "name": "Sample App Device"
}
```

Example curl call:
```
curl --request POST \
  --url https://platform.mydevices.com/v1.1/things/pair \
  --header 'authorization: Bearer OAUTH_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
	"hardware_id": "YOUR HARDARE ID",
	"name": "Sample App Device"
}'
```

Successful response will return the following: 
```
{
	"id": "DEVICE ID",
	"name": "Sample App Device",
	"hardware_id": "HARDWARE ID,
	"user_id": "YOUR USER ACCOUNT ID",
	"device_type_id": "YOUR DEVICE TYPE ID",
	"created_at": "2017-08-03T20:41:57.000Z",
	"updated_at": "2017-08-03T20:41:57.000Z",
	"last_online": null,
	"deactivated_at": null,
	"status": "ACTIVATED",
	"active": 0,
	"parent_id": null,
	"search_key": null,
	"properties": {
		"codec": "CODEC IF APPLICABLE,
		"deveui": "HARDWARE ID",
		"network": "NETWORK IF APPLICABLE",
		"activation": "activated",
		"device_registry_id": "YOUR ID ON REGISTRY ADD"
	},
	"device_type": {
    "id": "DEVICE TYPE ID",
    "created_at": "2017-08-08T23:51:00.000Z",
    "updated_at": "2017-08-08T23:51:00.000Z",
    "name": "My Gateway",
    "description": "A sample gateway",
    "version": "v1.0",
    "manufacturer": "Example Inc.",
    "parent_constraint": "NOT_ALLOWED",
    "child_constraint": "ALLOWED",
    "category": "module",
    "subcategory": "sample",
    "transport_protocol": "someprotocol"
		"model": null,
		"protocol_version": null,
		"data_type": null,
		"proxy_handler": null,
		"application_id": "APP KEY"
	},
	"key": null,
	"client_id": "YOUR CLIENT ID",
	"children": []
}
```

After adding a Gateway device, we can then add sensors and actuators that will communicate with the gateway. Let's activate the sensor and actuator example devices that we previously provisioned. After selecting to add a Device, the user is asked for device information needed to activate the sensor or actuator. After entering in the information, the Cayenne Cloud API can be used to activate the device.

*NOTE: Notice how the user is asked for the __ID__ during the activation process. This ID is the __Hardware ID__ generated earlier during the device provisioning step.*

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524084522/Restaurant-iPhone_AddSensor-1-2.png" width="346" height="615" alt="Sample App Add Sensor screen"><br/><br/></p>

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524104638/Restaurant-iPhone_AddSensor-1-1.png" width="346" height="615" alt="Sample App Add Sensor screen2"><br/><br/></p>

To add a sensor to a gateway, we will issue a `POST` to `https://platform.mydevices.comv/v1.1/things` with a `Authorization: Bearer OAUTH_TOKEN` header and the following example payload:
```
{
  "name": "Sensor Name",
  "device_type_id": "SENSOR DEVICE TYPE ID",
  "parent_id": "ID WHEN ADDING GATEWAY",
  "hardware_id": "HARDWARE ID",
  "properties": {
    "someproperty": "Additional properties can be added here for your sensor",
    "deveui": "YOUR HARDARE ID",
    "network": "some network if applicable"
  },
  "active": 1
  "status": "ACTIVATED"
}
```

Sample curl call:
```
curl --request GET \
  --url https://platform.mydevices.com/v1.1/things \
  --header 'authorization: Bearer OAUTH_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
  "name": "Sensor Name",
  "device_type_id": "SENSOR DEVICE TYPE ID",
  "parent_id": "ID WHEN ADDING GATEWAY",
  "hardware_id": "HARDWARE ID",
  "properties": {
    "someproperty": "Additional properties can be added here for your sensor",
    "deveui": "YOUR HARDARE ID",
    "network": "some network if applicable"
  },
  "active": 1
  "status": "ACTIVATED"
}'
```

---


#### Getting Real-Time Device Data

After devices are activated and begin transmitting data to Cayenne, the Cayenne Cloud API can be used to query real-time data on the device. Let's take a look at the Tank Monitoring sample app and see how it uses the Cayenne Cloud API to fetch current device status so that it can be displayed on the *Status* screen.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170525074129/Tank-Monitoring-Status-screen.png" width="346" height="615" alt="Sample App Status screen"><br/><br/></p>


#### Remote Control

In addition to monitoring Sensor devices, the Cayenne Cloud API also supports Actuators. Actuators devices allow you to not only monitor the status of the actuator, but also to remotely control their state. For example, you can remotely lock or unlock a Door Lock, or change the brightness of a Light. The Tank Monitoring sample app includes an example of a Door Lock that we can exmaine. From the *Status* screen we see that there is a toggle shown next to the **Gate Lock** device. The user is able to tap on this button to switch the current lock state of the device. Let's take a look at how this is accomplish using the Cayenne Cloud API.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170525074533/Tank-Monitoring-Status-screen-actuator-highlight.png" width="492" height="615" alt="Sample App Device History screen"><br/><br/></p>


#### Getting Device History

Cayenne maintains historical information on data received from connected devices. Let's examine using the Cayenne Cloud API to query historical data for our example devices and see some very different examples of how the Tank Monitoring sample app uses this data to display the information to the user.

##### Sensor History example

Tapping on a device from the Tank Monitoring sample app's *Status* screen opens the *Device History* screen which displays historical device data. The user can use this table view to filter and examine data. Let's explore how this is accomplished using the Cayenne Cloud API.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524084752/Restaurant-iPhone_Sensor-1-1.png" width="346" height="615" alt="Sample App Device History screen"><br/><br/></p>


##### Asset Tracking example

The Tank Monitoring sample app's *Map* screen provides another great example of using historical device data in a unique way. In this case, for display of device location and status on a map. Let's take a look at this *Asset Tracking* feature and how the Cayenne Cloud API is used to accomplish this.

**Displaying device location on a map**

On the *Map* screen in the Tank Monitoring sample app, the user can see the location and movement of their devices on a map. This unique presentation makes use of current and historical device information provided in the Cayenne Cloud API to visualize device location data.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524091320/Restaurant-iPhone_SensorMap-1-13.png" width="660" height="371" alt="Sample App rotated map screen"><br/><br/></p>


**Displaying historical device data on a map**

In addition to visualizing the location of the device on a map, a user can tap on a device marker to pull up additional information. Within the popup dialog that appears, the historical information on the device is displayed. This allows the Tank Monitoring sample app user to not only see where the device was, but also to see its status at that time.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524091339/Restaurant-iPhone_SensorMap-1-9.png" width="346" height="615" alt="Sample App Map screen"><br/><br/></p>

#### Alerts

Alerts allow you to receive notifications when certain conditions are met. Let's take a look at the Tank Monitoring sample app and see how the user can create an Alert and manage existing alerts using the Cayenne Cloud API.

##### Creating an Alert

To create a new Alert, the user must specify information on what conditions should be met and who should be notified. After obtaining the information from the user, a new Alert can be created.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524100109/Restaurant-iPhone_Alert-1-4.png" width="346" height="615" alt="Sample App create alert screen"><br/><br/></p>

##### Managing Alerts

After setting up alerts, users will want to be able to manage them. Let's take a look at the Tank Monitoring sample app's *Alerts* screen. From this screen the user can see a list of existing alerts, information on each alert, and they can manage the alerts. Let's see how these tasks are accomplished using the Cayenne Cloud API.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170524100107/Restaurant-iPhone_Alert-1-2.png" width="346" height="615" alt="Sample App Alerts screen"><br/><br/></p>

#### Multi-Tenant

In addition to manging Accounts and Devices, the Cayenne Cloud API also provides functionality to help create and manage Users. Using the Multi-Tenant features found in the Cayenne Cloud API, you can create Users and assign Roles and permissions. Let's take a look at an example which demonstrates these features.

##### Creating Users, assigning Roles & Permissions

Before you can manage users and assign permission, a new User must be created. As an example, this can be done from an *Add User* screen. In order to get started with creating a new user, we must first get some basic information on the user.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170525090358/Multi-Tenant-2.png" width="660" height="483" alt="Multi tenant Add User 1"><br/><br/></p>

After capturing the basic user information, we then select the **Role** and **Permissions** available to the user. By adjusting the user's role and permissions, we can control what access the user has within the account. Setting the user's **Role** will determine certain default **Permissions** available. If you want, you can override the default permissions by specifying what the user should have on a per-feature basis.

- **View:** Allows the User to view this feature. Without this permission, the feature will not be visible to the user.
- **Add/Edit:** Allows the User to modify items within this feature. For example, to Add device or Edit/Update information.
- **Delete:** Allows the User to delete items within this feature. For example, to remove devices.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170525090412/Multi-Tenant-3.png" width="660" height="483" alt="Multi tenant Add User 2"><br/><br/></p>

After gathering the information required to create a new User, we can then use the Cayenne Cloud API to create a new user. Let's examine how this is accomplished.


##### Managing existing users

After creating some Users, we need to be able to manage them. Let’s take a look at an example *Users* screen. From this screen you can see a list of existing users and we can manage the existing user from here. Let's see how these tasks are accomplished using the Cayenne Cloud API.

<p style="text-align:center"><br/><img src="https://s3.amazonaws.com/cloudfront-mydevices-wordpress/wp-content/uploads/20170525090259/Multi-Tenant-1.png" width="660" height="290" alt="Multi tenant manage Users screen"><br/><br/></p>
