export const signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo'))
        errors.pseudo = 'Pseudo is already taken or invalid';

    if (err.message.includes('email'))
        errors.email = 'Email is already taken';

    if (err.message.includes('password'))
        errors.password = 'Password must be at least 6 characters long';

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = 'Pseudo is already taken';

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = 'Email is already taken';

    return errors;
}