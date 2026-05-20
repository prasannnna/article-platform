const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title must be specified"],
            trim: true,
            minlength: [5, "Title must be more than 5 letters"],
            maxlength: [100, "Title must be less than 100 characters"]
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        authorName: {
            type: String,
            required: [true, "Author is not specified"],
            trim: true
        },
        overview: {
            type: String,
            required: [true, "Overview must be written"],
            maxlength: [1000, "Overview must not exceed 100 characters"],
            minlength: [10, "Overview should be atleast 10 characters"]
        },
        description: {
            type: String,
            required: [true, "Description must be written"],
            maxlength: [5000, "Description must not exceed 800 characters"],
            minlength: [10, "Description should be atleast 50 characters"]
        },
        category: {
            type: String,
            enum: ['hostel', 'mess', 'ground', 'food', 'ambience', 'studies', 'culturals', 'other'],
            required: true,
            default: 'other'
        },
        views: {
            type: Number,
            default: 0
        },
        votes: {
            type: Number,
            default: 0
        },
        imageUrl: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

articleSchema.index({ createdAt: -1 });
articleSchema.index({ votes: -1 });
articleSchema.index({ author: 1 });
articleSchema.index({ category: 1 });

articleSchema.methods.incrementViews = async function() {
    this.views += 1;
    return await this.save();
};

module.exports = mongoose.model('Article', articleSchema);

