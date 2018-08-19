const path = require("path");
const multer  = require('multer');
const upload = multer();

const assetsDir = path.join(__dirname, "psqlweb-assets");

const blankMiddleware = function (req, res, next) {
    next();
};

exports.init = function (app, options) {
    middleware = options.middleware !== undefined ? options.middleware : blankMiddleware;

    app.get(
        new RegExp("/psql(\/)*$"),
        middleware,
        function (req, resp) {
            resp.sendFile(path.join(assetsDir, "index.html"));
        });

    app.get(
        new RegExp("/psql((\/style.css)|(\/index.js))"),
        middleware,
        function (req, resp) {
            resp.sendFile(path.join(assetsDir, req.params[0]));
        });

    app.post(
        "/psql",
        upload.array(), middleware,
        async function (req, resp) {
            let data = req.body;
            let { command } = data;
            let result = await app.query(command);
            resp.json(result);
        });
}

// End
