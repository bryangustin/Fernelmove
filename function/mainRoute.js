const {ensureAuthenticated} = require("../config/403.js");

// Function to set all the default get Routes
const mainRoute = function (app, route, file, log) {
    
    if (log) {
        app.get(route, ensureAuthenticated, (req, res) => {
            res.render(file)
        })
    } else {
        app.get(route, (req, res) => {
            res.render(file)
        })
    }
    

}

module.exports = mainRoute