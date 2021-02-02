// Function to set all the default get Routes
const mainRoute = function (app, route, file) {
    app.get(route, (req, res) => {
        res.render(file)
    })
}

module.exports = mainRoute