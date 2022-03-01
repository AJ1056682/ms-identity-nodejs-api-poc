const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { AuthConfig } = require('./Config'); // Import the Authorization.js middleware
const { folder, common } = require('./permissions');


const app = express();
app.options('*', cors()) // include before other routes
const auth = new AuthConfig(app);

app.use(auth.setup());

app.use(morgan('dev'));

// enable CORS (in production, modify as to allow only designated origins)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// exposed API endpoint
app.get('/hello', auth.authUserScope, (req, res) => {
        // Service relies on the name claim.  
        res.status(200).json({
            'API': 'Hello API endpoint !',
            'name': req.authInfo['name'],
            'issued-by': req.authInfo['iss'],
            'issued-for': req.authInfo['aud'],
            'scope': req.authInfo['scp'],
            'role': req.authInfo['roles'] || 'Non',
            'user_id': req.authInfo['oid'],
        });
    }
);

app.get('/folders', auth.authGlobalAdmin, (req, res) => {
        // Service relies on the name claim.
        const userInfo = {
            'access': 'Global folders!',
            'country': 'All country !',
            'name': req.authInfo['name'],
            'issued-by': req.authInfo['iss'],
            'issued-for': req.authInfo['aud'],
            'scope': req.authInfo['scp'],
            'role': req.authInfo['roles'] || 'Non',
            'user_id': req.authInfo['oid'],
        };
        res.status(200).json({
            userInfo,
            folders: folder.globalFolders(req.authInfo['role']),
        });
    }
);

app.get('/country/:countryId/folders', auth.authByCountryRole, (req, res) => {
        // Service relies on the name claim.
        const userInfo = {
            'access': 'Folders per country !',
            'country': req.params.countryId,
            'name': req.authInfo['name'],
            'issued-by': req.authInfo['iss'],
            'issued-for': req.authInfo['aud'],
            'scope': req.authInfo['scp'],
            'role': req.authInfo['roles'] || 'Non',
            'user_id': req.authInfo['oid'],
        };
        res.status(200).json({
            userInfo,
            folders: folder.scopedFolders(req.authInfo['roles'], req.params.countryId, req.authInfo['oid'])
        });
    }
);

app.use('/api/access-error', (req, res, next) => {
    res.status(403).send({
        message: 'You are not authorized to access this resource'
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = app;