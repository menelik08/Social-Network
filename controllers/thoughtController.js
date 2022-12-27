const { User, Thought } = require('../models');

module.exports = {
    
    getThoughts(req, res) {
        Thought.find({})
        .then(thoughts => {
            return res.json(thoughts)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then(thought => {
            !thought 
                ? res.status(404).json({ message: 'No thought with that ID' })
                :  res.json(thought)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then(thought => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id }},
                { runValidators: true, new: true }
            )
            .then(user => {
                !user 
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then(thought => {
            !thought 
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
        })
        .catch(err => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then(thought => {
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : User.findOneAndUpdate(
                    { username: thought.username },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                )
        .then(() => {
            res.json({ message: 'Thought successfully deleted' })
        })
        .catch(err => res.json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then(thought => 
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.body.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(thought => 
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
};