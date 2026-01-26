import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

// Register
router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ],
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { username, email, password } = req.body;
        // Sanitize
        email = email.toLowerCase().trim();
        username = username.trim();

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            user = new User({
                username,
                email,
                passwordHash,
            });

            await user.save();

            const payload = {
                id: user.id,
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '5d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').exists().withMessage('Password is required'),
    ],
    async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { email, password } = req.body;
        email = email.toLowerCase().trim();
        console.log(`[Login Attempt] Email: '${email}'`);

        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log(`[Login Failed] User not found: '${email}'`);
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                console.log(`[Login Failed] Password mismatch for user: '${email}'`);
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const payload = {
                id: user.id,
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '5d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

export default router;
