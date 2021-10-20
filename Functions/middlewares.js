const jwt = require('jsonwebtoken');
const UserModel = require('../App/Users/model');
const enviroment = require('dotenv');

enviroment.config();

const authentication = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Token is not valid'
        });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

// const adminAuthentication = (req, res, next) => {
//   let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (token && token.startsWith('Bearer ')) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       }
//       else {
//         try {
//           const user = await UserModel.findOne({ _id: decoded._id }, { password: 0 });
//           if (user) {
//             if (user.role === 'admin') {
//               req.decoded = decoded;
//               next();
//             }
//             else {
//               return res.status(403).json({
//                 status: 'Failed',
//                 message: 'No such user'
//               });
//             }
//           }
//         } catch (error) {
//           return res.status(500).json({
//             status: 'Error',
//             message: error.message
//           });
//         }
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Auth token is not supplied'
//     });
//   }
// };

// const assessorAuthentication = (req, res, next) => {
//   let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (token && token.startsWith('Bearer ')) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       } else {
//         try {
//           const user = await UserModel.findOne({ _id: decoded._id }, { password: 0 });
//         if (user) {
//           if (user.role === 'assessor') {
//             req.decoded = decoded;
//             next();
//           }
//           else {
//             return res.status(401).json({
//               status: 'Failed',
//               message: 'Not Authorized'
//             });
//           }
//         }
//         else {
//           return res.status(403).json({
//             status: 'Failed',
//             message: 'No such user'
//           });
//         }
//         } catch (error) {
//           return res.status(500).json({
//             status: 'Error',
//             message: error.message
//           });
//         }
        
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Auth token is not supplied'
//     });
//   }
// };

// const candidateAuthentication = (req, res, next) => {
//   let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (token && token.startsWith('Bearer ')) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       } else {
//         try {
//           const user = await UserModel.findOne({ _id: decoded._id }, { password: 0 });
//         if (user) {
//           if (user.role === 'candidate') {
//             req.decoded = decoded;
//             next();
//           }
//           else {
//             return res.status(401).json({
//               status: 'Failed',
//               message: 'Not Authorized'
//             })
//           }
//         }
//         else {
//           return res.status(403).json({
//             status: 'Failed',
//             message: 'No such user'
//           });
//         }
//         } catch (error) {
//           return res.status(500).json({
//             status: 'Error',
//             message: error.message
//           });
//         }
        
        
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Auth token is not supplied'
//     });
//   }
// };

// const authorizedRoles = (req, res, next) => {
//   let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
//   if (token && token.startsWith('Bearer ')) {
//     // Remove Bearer from string
//     token = token.slice(7, token.length);
//   }

//   if (token) {
//     jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
//       if (err) {
//         return res.json({
//           success: false,
//           message: 'Token is not valid'
//         });
//       }
//       else {
//         try {
//           const user = await UserModel.findOne({ _id: decoded._id }, { password: 0 });
//           if (user) {
//             if (user.role === 'admin' || user.role === 'assessor') {
//               req.decoded = decoded;
//               next();
//             }
//             else {
//               return res.status(403).json({
//                 status: 'Failed',
//                 message: 'No such user'
//               });
//             }
//           }
//         } catch (error) {
//           return res.status(500).json({
//             status: 'Error',
//             message: error.message
//           });
//         }
//       }
//     });
//   } else {
//     return res.json({
//       success: false,
//       message: 'Auth token is not supplied'
//     });
//   }
// };

module.exports = {
  authentication
}