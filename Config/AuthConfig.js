const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const config = require('./config.json');
const { user, common} = require('../permissions')

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
            failureRedirect: '', // Replace with an endpoint which can be used to display an error page or JSON error message
            session: false
        });
    }

    setup() {
        return this.passportAuth;
    }

    authUserScope(req, res, next) {
        // Perform any extra authorization steps here. Authenticated user object can be accessed via req.user
        if (req.authInfo['scp'].split(' ').map(scope => scope.toLowerCase()).indexOf('access_as_super_user') < 0) {
            console.log('Invalid Scope, 403');
            return res.status(403).send({message: 'You are not authorised to access this application'});
        }
        next();
    }

    authGlobalAdmin(req, res, next) {
        if (common.isGlobalAdmin(req.authInfo['roles'])) {
            next();
        } else {
            res.status(401);
            return res.send(`Not allowed to access ${req.params.countryId} data !`);
        }
    }

    authByCountryRole(req, res, next) {
        if (!req.authInfo['roles'].includes(req.params.countryId) && !common.isGlobalAdmin(req.authInfo['roles'])) {
            res.status(401);
            return res.send(`Not allowed to access ${req.params.countryId} data !`);
        }
        next();
    }
}

module.exports = Authorization
