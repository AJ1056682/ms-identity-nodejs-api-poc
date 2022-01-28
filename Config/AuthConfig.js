const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const config = require('./config.json');
const { user } = require('../permissions')

const options = {
    identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
    issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID, // audience of this application
    validateIssuer: config.settings.validateIssuer,
    passReqToCallback: config.settings.passReqToCallback,
    loggingLevel: config.settings.loggingLevel,
    scope: [...config.protectedRoutes.hello.scopes, ...config.protectedRoutes.dossiers.scopes, ...config.protectedRoutes.country_dossiers.scopes],
    authority: `https://${config.metadata.authority}/${config.credentials.tenantID}`,
};

class Authorization {
    constructor(router) {
        router.use(passport.initialize());
        const bearerStrategy = new BearerStrategy(options, (token, done) => {
            // Send user info using the second argument
            done(null, {}, token);
        });
        passport.use(bearerStrategy);
        this.passportAuth = passport.authenticate('oauth-bearer', {
            failureRedirect: 'https://login.microsoftonline.com/4f6f5fe5-4b52-4e8d-bc6f-96c27656a790/oauth2/v2.0/authorize?client_id=d5d7ea8a-a552-4041-926f-b2a3fc7f8347&scope=openid%20profile%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&client-request-id=65a0e04e-5f67-436b-ae69-39da55e05156&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.16.0&x-client-OS=&x-client-CPU=&client_info=1&code_challenge=gvaKRr9Y37WHDM3G6mSkn1e7DuVoVHzzMFuQuEU5eFU&code_challenge_method=S256&nonce=dbc7fcd9-e74a-44bc-9849-a1b57111e9a4&state=eyJpZCI6IjkwNmU0YjNkLTg5ZTgtNGM5Zi1hOGUyLWExMGVmMWFlMzg5ZiIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D', // Replace with an endpoint which can be used to display an error page or JSON error message
            session: false
        });
    }

    setup() {
        return this.passportAuth;
    }

    authUserScope(req, res, next) {
        // Perform any extra authorization steps here. Authenticated user object can be accessed via req.user
        if (req.authInfo['scp'].toLowerCase().indexOf('access_as_super_user') >= 0) {
            console.log('Invalid Scope, 403');
            return res.status(403).send({message: 'You are not authorised to access this application'});
        }
        next();
    }

    authGlobalAdmin(req, res, next) {
        if (isGlobalAdmin(req.authInfo['roles'])) {
            next();
        } else {
            res.status(401);
            return res.send(`Not allowed to access ${req.params.countryId} data !`);
        }
    }

    authByCountryRole(req, res, next) {
        if (!req.authInfo['roles'].includes(req.params.countryId) && !user.isGlobalAdmin(req.authInfo['roles'])) {
            res.status(401);
            return res.send(`Not allowed to access ${req.params.countryId} data !`);
        }
        next();
    }
}

module.exports = Authorization
