const { User } = require('../models');

module.exports = {
    
    getUsers(req, res) {
        User.find({})
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate('friends')
        .populate('thoughts')
        .then(user => {
            !user 
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    createUser(req, res) {
        User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err))
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then(user => {
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        })
        .catch(err => res.status(500).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId})
        .then(user => {
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        })
        .catch(err => res.status(500).json(err))
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId }, 
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then(user => {
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        })
        .catch(err => res.status(500).json(err))
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId }, 
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then(user => {
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        })
        .catch(err => res.status(500).json(err))
    }
};