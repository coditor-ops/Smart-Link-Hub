import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { auth } from '../middleware/auth';

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
            // Check for both email and username uniqueness
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });

            if (existingUser) {
                const message = existingUser.email === email 
                    ? 'Email already registered' 
                    : 'Username already taken';
                return res.status(400).json({ message });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = new User({
                username,
                email,
                passwordHash,
            });

            await user.save();
            console.log(`[Auth] User registered successfully: ${username} (${email})`);

            const payload = {
                id: user.id,
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '5d' }
            );

            res.status(201).json({ token });
        } catch (err: any) {
            console.error(`[Auth Error] Registration failed: ${err.message}`);
            res.status(500).json({ 
                message: 'Server Error during registration',
                error: err.message 
            });
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
                console.log(`[Auth] Login failed - User not found: ${email}`);
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                console.log(`[Auth] Login failed - Password mismatch: ${email}`);
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const payload = {
                id: user.id,
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '5d' }
            );

            res.json({ token });
        } catch (err: any) {
            console.error(`[Auth Error] Login failed: ${err.message}`);
            res.status(500).json({ message: 'Server Error' });
        }
    }
);

// Get current user
router.get('/me', auth, async (req: any, res: express.Response) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err: any) {
        console.error(`[Auth Error] Get current user failed: ${err.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
