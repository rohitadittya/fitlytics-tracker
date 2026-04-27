const getLoggedInUserId = (req): number => req?.loggedInUserId;
const setLoggedInUserId = (req, userId: number) => {
    req.loggedInUserId = userId;
};
const setLoggedInUserIsAdmin = (req) => {
    req.loggedInUserIsAdmin = true;
};
const getLoggedInUserIsAdmin = (req): boolean => req?.loggedInUserIsAdmin;

export {
    getLoggedInUserId,
    setLoggedInUserId,
    setLoggedInUserIsAdmin,
    getLoggedInUserIsAdmin
};