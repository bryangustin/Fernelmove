// Function to set all the default get Routes
const mainRoute = function (app, route, file, log) {
    app.get(route, (req, res) => {
        user: req.user,
        res.render(file)
    })
    console.log(log);
}

module.exports = mainRoute