const {Router} = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
    '/register', 
    [
        check('email', 'Inccorect email').isEmail(),
        check('password', 'Minimal length password 6 symbols')
            .isLength({min:6})

    ],
    async (req, res) => {
      
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data when you register'
            })
        }

        const {email, password} = req.body; 
        
        const candidate = await User.findOne({email});

        if(candidate) {
           return res.status(400).json({message: 'This user is already exist'});
        }

        const hasPassword = await bcrypt.hash(password, 12);
        const user = new User({email, password: hasPassword});

        await user.save();

        res.status(201).json({message: 'User has been created'});

    } catch (e) {
        console.log('e', e)
        
        res.status(500).json({ message: 'Something went wrong, try again'})
    }
});

router.post(
    '/login', 
    [
        check('email', 'Input correct email').normalizeEmail().isEmail(),
        check('password', 'Input password').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)
    
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data when you login in system'
                })
            }

            const {email, password} = req.body;

            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).json({message: 'User not found'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({message: 'Unfaithful password, try again'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })
    
    
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong, try again'})
        }
});

module.exports = router;