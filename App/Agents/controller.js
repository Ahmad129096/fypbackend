const Agents = require('./model');
const jwt = require('jsonwebtoken');


module.exports = {
    Create: async (req, res) => {
        try {
            let agent = {};
            let token = "";

            agent = await Agents.create(req.body);
            
            const agentType = req.body.agentType;

            token = jwt.sign({ _id: agent.id.toString() },
                process.env.TOKEN_SECRET
            );
            await Agents.updateOne({ _id: agent.id }, {
                token: token
            });
            
            agent.token= token;

            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully registered a agent',
                data: agent
            });

        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            let agent = {};
            agent = await Agents.findOne({email: email});
            if (agent.email !== email) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            if (agent.password !== password) {
                return res.status(403).json({
                    status: 'Failed',
                    message: 'Incorrect Email/Password'
                });
            }
            return res.status(200).json({
                status: 'Successful',
                data: agent
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Read: async (req, res) => {
        try {
            let agent = {};
            const id = req.params.id;
            agent = await Agents.findOne({_id: id}, {password: 0});
            return res.status(200).json({
                status: 'Successful',
                data: agent
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Update: async (req, res) => {
        try {
            const id = req.params.id;
            agent = await Agents.findOneAndUpdate({_id: id}, {
                $set: req.body
            });
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully updated agent',
                data: agent
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    Delete: async (req, res) => {
        try {
            const id = req.params.id;
            await Agents.remove({_id: id});
            return res.status(200).json({
                status: 'Successful',
                message: 'Successfully Deleted agent'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    },
    List: async (req, res) => {
        try {
            let Agents = [];
            Agents = await Agents.find({});
            return res.status(200).json({
                status: 'Successful',
                data: Agents
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Error',
                message: error.message
            });
        }
    }
}



