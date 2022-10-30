const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { urlencoded } = require('express');
const dotenv = require('dotenv')
dotenv.config();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 8080;




const routers = {
    '/auth': require('./routes/auth.routes'),
    '/': require('./routes/home.routes'),
    '/komentar': require('./routes/komentar.routes')
}

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


for (const path in routers) {
    app.use(path, routers[path]);
}

/*app.get("/", (req, res) => {
    if (req.oidc.user) {
        res.render("home",
        {
            title: "home",
            user: (req.oidc.user)
        });
    } else {
        res.render("home",
        {
            title: "home"
        });
    }
    
});*/

if (externalUrl) {
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
}
else {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });

}


