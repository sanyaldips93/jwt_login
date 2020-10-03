const router = require('express').Router();
const ensureAuth = require('./verifyToken');

router.get('/', ensureAuth, (req, res) => {
    res.json({
        posts : {
            remarks: 'Congrats! You are logged in to see this!'
        }
    })
})


module.exports = router;
