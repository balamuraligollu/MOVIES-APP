const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.role)) {
            next();
        } else {
            return res.status(403).json({ errors: "You do not have access to this page." });
        }
    };
};
export default authorizeUser