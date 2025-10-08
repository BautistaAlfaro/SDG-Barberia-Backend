import bcrypt from 'bcrypt';
export const hashPassword = async (password) => {
    if (!password) {
        throw new Error("Password must not be empty");
    }
    return bcrypt.hash(password, 10);
};
export const comparePassword = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword)
        return false;
    return bcrypt.compare(plainPassword, hashedPassword);
};
//# sourceMappingURL=hash.js.map