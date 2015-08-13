# angular-npolar
 
[angular-npolar](https://github.com/npolar/angular-npolar) simplifies development of Angular web apps driven by the [Npolar API](http://api.npolar.no/).

### npolarApiConfig
Environment-based configuration.

### NpolarApiResource
Extends ngResource and provides a resource factory method. 

### npolarApiAuthInterceptor
Injects JWT Bearer tokens in Npolar API requests.

### NpolarApiSecurity

### NpolarBaseController

### NpolarEditController


## Developing
Lots of applications depend on angular-npolar. Use npm link to use your local copy during development.
``sh
➜  angular-npolar git:(master) ✗ sudo npm link
``

``sh
➜  npdc-application git:(master) ✗ npm link angular-npolar
``