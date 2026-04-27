import jwt from 'jsonwebtoken';
import { AuthError } from '../custom-errors/AuthError';
import { setLoggedInUserId } from '../utils/auth-helpers.utils';

const isAuthorizedUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new AuthError('Access Denied, unauthorized!', 401);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        setLoggedInUserId(req, decodedToken.userId);
        next();
    }
    catch (err) {
        console.error('Token verification failed:', err);
        throw new AuthError('Invalid Token', 401);
    }
};

export {
    isAuthorizedUser
};