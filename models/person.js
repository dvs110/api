const express = require("express")
const mongoose = require("mongoose")
const { Schema } = mongoose;
const personSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    aboutme: { type: String, default: 'Add something about you.' },
    phone: { type: String },
    linkedin: { type: String, default: 'Linkedin' },
    github: { type: String, default: 'Github' },
    facebook: { type: String, default: 'Facebook' },
    twitter: { type: String, default: 'Twitter' },
    instagram: { type: String, default: 'Instagram' },
    website: { type: String, default: 'Website' },
    image: { type: String, default: 'https://www.cipherschools.com/static/media/Cipherschools_icon@2x.3b571d743ffedc84d039.png' },
    follower: {
        type: String,
        default: "0"
    },
    highesteducation: { type: String, default: 'Secondary' },
    whatdoudocurrently: { type: String, default: 'College Student' }
});
const Car = mongoose.model("Car", personSchema);

module.exports = User;