const jsonwebtoken = require("jsonwebtoken");
const User = require('../models/user');
const Admin = require('../models/admin');

const tokenDecode = (req) => {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        console.log("token: "+ bearerHeader);
        const bearer = bearerHeader.split(' ')[1];
        try {
            const tokenDecoded = jsonwebtoken.verify(
                bearer,
                process.env.JWT_KEY
            );
            return tokenDecoded;
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
}

exports.verifyAdminToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) { 
        const admin = await Admin.findById(tokenDecoded.id);
        console.log(tokenDecoded.id);
        if (!admin) return res.status(403).json('Not allowed!');
        req.admin = admin;
        next();
    } else {
        console.log("Decode Token is "+tokenDecoded);
        res.status(401).json('Unauthorized');
    }
}

exports.isUser = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        const user = await User.findById(tokenDecoded.id);
        if (!admin && !user) return res.status(403).json('Not allowed!');

        req.admin = admin;
        req.user = user;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}

exports.isTutor = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        const user = await User.findById(tokenDecoded.id);
        if (!admin && !user) return res.status(403).json('Not allowed!');
        if(user.role !== 'tutor') return res.status(403).json('Not allowed!');
        
        req.admin = admin;
        req.user = user;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}

exports.verifyToken = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);
    if (tokenDecoded) {
        const admin = await Admin.findById(tokenDecoded.id);
        const user = await User.findById(tokenDecoded.id);
        
        if (!admin && !user ) return res.status(403).json('Not allowed!');
        
        req.admin = admin;
        req.user = user;
        next();
    } else {
        res.status(401).json('Unauthorized');
    }
}