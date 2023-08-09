const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');


const signupController = async (req, res) => {
    try {
        // res.send("i am signup controller")
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            // return res.status(400).send('email and password are required');
            return res.send(error(400, 'All fields are required'))
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            // return res.status(409).send("Email is already registered")
            return res.send(error(409, 'User is already registered'))
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // return res.status(201).json({
        //     user,
        // })
        // const newUser = await User.findById(user._id)
        return res.send(success(201, 'user created successfully'))// {
        // user,
        // newUser,

        // }))
    } catch (e) {
        // console.log(error)
        return res.send(error(500, e.message))
    }
}

const loginController = async (req, res) => {
    try {
        // res.send('from login')
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send('email and password are required');
            return res.send(error(400, 'email and password are required'))
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            // return res.status(404).send("User is not Registered");
            return res.send(error(404, "User is not Registered"))
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            // return res.status(403).send("Incorrect password");
            return res.send(error(403, "Incorrect password"))
        }
        const accessToken = generateAccessToken({
            // user,
            _id: user._id,
            // email:user.email,
        })

        const refreshToken = generateRefreshToken({
            _id: user._id,
        })
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, {
            accessToken

        }))
        // return res.status(200).json({ accessToken })
        // return res.status(200).json({ accessToken, refreshToken })
        // return res.status(200).json({user})

    } catch (e) {
        return res.send(error(500, e.message))
    }
}


//this api will check the refreToken valid and generate new token
const refreshAccessTokenController = async (req, res) => {
    // const { refreshToken } = req.body;
    const cookies = req.cookies;

    if (!cookies.jwt) {
        // return res.status(401).send("refresh token cookies is required")
        return res.send(error(401, "refresh token cookies is required"))
    }
    const refreshToken = cookies.jwt;
    // console.log('hehehehehe  ', refreshToken)

    // if (!refreshToken) {
    //     return res.status(401).send("refresh token is required")
    // }



    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
        );
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken }))
        // return res.status(201).json({ accessToken });
    } catch (e) {
        console.log(e);
        // return res.status(401).send('Invalid refresh token');
        return res.send(error(401, 'Invalid refresh token'))

    }
}

const loguotController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        });

        return res.send(success(200, "user logged out"));

    } catch (e) {
        return res.send(error(500, e.message))

    }
}


//internal funtion //ye function ham token create karne ke liye banate hai trough jwt(jsonwebtoken)
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d"

        });//es me data bata rehe hai jis ka token banana ha 
        //or security key bata rahe hai or expairing time bata rahe hai

        // console.log(token);
        return token;
    } catch (error) {
        console.log(error)

    }


}

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y"

        });//es me data bata rehe hai jis ka token banana ha 
        //or security key bata rahe hai or expairing time bata rahe hai

        // console.log(token);
        return token;
    } catch (error) {
        console.log(error)

    }
}


module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    loguotController,
}