const express = require('express')
const app = express()

app.use(express.json())


function checkPermissions(permission) {
    return (req, res, next) => {
        if (permission === 'View') {
            if (req.user.permissions === 'Restricted') {
                res.status(401)
                return res.send('You do not have the correct permissions.')
            }
        }
        else if (permission === 'Edit') {
            if (req.user.permissions !== 'Edit') {
                res.status(401)
                return res.send('You do not have the correct permissions.')
            }

        }
        next();
    }
}

module.exports = {
    checkPermissions
}