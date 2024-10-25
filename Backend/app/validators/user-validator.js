import User from '../models/user-model.js';

export const userRegisterSchema = {
    username: {
        in: ['body'],
        exists: { 
            errorMessage: 'Username field is required'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        isLength: {
            options: { min: 3, max: 30 },
            errorMessage: 'Username must be between 3 and 30 characters long'
        },
        trim: true,
        custom: {
            options: async (value) => {
                try {
                    const user = await User.findOne({ username: value });
                    if (user) {
                        throw new Error('Username already taken');
                    }
                } catch (err) {
                    throw new Error(err.message);
                }
                return true;
            }
        }
    },
    email: {
        in: ['body'],
        exists: { 
            errorMessage: 'Email field is required'
        }, 
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                try {
                    const user = await User.findOne({ email: value });
                    if (user) {
                        throw new Error('Email already taken');
                    }
                } catch (err) {
                    throw new Error(err.message);
                }
                return true;
            }
        }
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password field is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                maxLength: 128,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbol: 1,
                minNumber: 1
            },
            errorMessage: 'Password should consist of at least one lowercase letter, one uppercase letter, one symbol, one number, and should be at least 8 characters long'
        },
        
        trim: true,
    },
};

export const userLoginSchema = {
    username: {
        in: ['body'],
        exists: { 
            errorMessage: 'Username field is required'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        trim: true,
    },
    email: {
        in: ['body'],
        optional: true, 
        isEmail: {
            errorMessage: 'Email should be in a valid format'
        },
        trim: true,
        normalizeEmail: true,
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password field is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                maxLength: 128,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbol: 1,
                minNumber: 1
            },
            errorMessage: 'Password should consist of at least one lowercase letter, one uppercase letter, one symbol, one number, and should be at least 8 characters long'
        },
        trim: true,
    }
};

