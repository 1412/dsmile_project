var express = require('express');
var path = require('path');
var fs = require('fs');

var cons = require('consolidate');
var ejslayout = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var favicon = require('serve-favicon');
var responseTime = require('response-time');
var morgan = require('morgan');
var methodOverride = require('method-override');
var csrf = require('csurf');
var session = require('cookie-session');
var compression = require('compression');
var timeout = require('connect-timeout');

var publicdir = path.join(__dirname, 'public');
var routedir = path.join(__dirname, 'routes');
var viewdir = path.join(__dirname, 'views');
var DB = require('./db/schema.js');
var port = 3000;
var app = express();

// view engine setup
app.set('title', 'D\'Smile Klinik');
app.set('x-powered-by', '1412 @ NodeJS Express');
app.set('views', viewdir);
app.engine('ejs', cons.ejs);
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(ejslayout);
app.use(timeout());
app.use(session({
    keys: ['secret'],
    secureProxy: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(serveStatic(publicdir, {'index': ['default.html', 'default.htm', 'index.htm', 'index.html']}));
// app.use(serveIndex(publicdir, {'icons': true}));
app.use(favicon(publicdir + '/favicon.ico'));
app.use(responseTime());
app.use(morgan('dev'));
app.use(methodOverride('X-HTTP-Method'))          // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))      // IBM
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));
app.use(csrf());
app.use(compression({
    threshold: 512
}));
app.use(function (req, res, next){
  if (!req.timedout) next();
});

function setRoutes(scriptpath){
    var stat = fs.lstatSync(scriptpath)
    if (stat.isDirectory()) {
        //TODO: should handle new/rename/remove route dir
        var files = fs.readdirSync(scriptpath);
        for (var i = 0; i < files.length; i++) {
            setRoutes(scriptpath + path.sep + files[i])
        }
    } else if (stat.isFile()) {
        //TODO: should handle new/rename/remove route
        if (path.extname(scriptpath) == ".js") {
            var route = scriptpath.replace(routedir, "").replace(/\.js$/, "");
            if (route == "/_root") {
                route = "/";
            }
            delete require.cache[require.resolve(scriptpath)];
            var found = false;
            var isrouter = false;
            var routescript = require(scriptpath);
            if (routescript.__proto__ == express.Router().__proto__) {
                isrouter = true;
                for (var i = 0; i < app._router.stack.length; i++) {
                    if (app._router.stack[i] === undefined) {
                        continue;
                    }
                    if (app._router.stack[i].regexp.toString() == "/^\\"+route+"\\/?(?=/|$)/i") { 
                        found = true;
                        if (isrouter) {
                            app._router.stack[i].handle = require(scriptpath);                            
                        }
                        break;
                    }
                }
                if (!found && isrouter) {
                    app.use(route, routescript);
                }
            }
            fs.unwatchFile(scriptpath);
            fs.watchFile(scriptpath, function (current, brefore) {
                setRoutes(this.path);
            }.bind({ path: scriptpath, app:app }));
        }
    }
}
setRoutes(routedir);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

DB(function(){
    app.listen(port);
    console.log("Listening to port: " + port);
});

module.exports = app;
