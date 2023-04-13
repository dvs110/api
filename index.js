const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { createError } = require("./utils/error.js");
// const Car = require("./models/person.js")
const app = express()

app.use(cors());
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: false }))

app.use(express.json());

// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.key);
//         console.log("connected to mondodb");
//     } catch (error) {
//         throw error;
//     }
// }
// mongoose.connection.on('disconnected', () => { //if mongodb got disconnected
//     console.log("mongodb disconnected");
// });
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

const DB = process.env.key;
mongoose.connect("DB", {
    useNewUrlParser: true,

}).then(() => {
    console.log("Connection successfully established")
}).catch((err) => console.log('no connection', err))


app.post('/form', async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(req.body);
    const newperson = new Car(
        { ...req.body, password: hash }
    );
    try {
        const savedperson = await newperson.save();
        res.status(200).json(savedperson)

    } catch (err) {
        // next(err)
    }
});

app.post("/verify", async (req, res, next) => {
    try {
        console.log(req.body.email);
        const person = await Car.findOne({ email: req.body.email })
        console.log(person);
        if (person == null) {
            res.status(200).json(1)
        } else {

            res.status(200).json(0)
        }


    } catch (err) {
        console.log(err);
        res.status(200).json("error aa gaya")
        // next(err)
    }

})

app.post("/signin", async (req, res, next) => {
    try {
        console.log(req.body);
        const person = await Car.findOne({ email: req.body.email })
        console.log(person);
        if (person == null) {
            res.status(200).json(0)
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, person.password);
            if (isPasswordCorrect) {
                res.status(200).json(person)
            }
            else
                res.status(200).json(0)
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error aa gaya")
        // next(err)
    }

})

app.post("/pass/:id", async (req, res, next) => {
    try {
        const person = await Car.findById(req.params.id);

        if (person == null) {
            res.status(200).json(0)
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password1, person.password);
            if (isPasswordCorrect) {
                res.status(200).json(person)
            }
            else
                res.status(200).json(0)
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")
        // next(err)
    }

})
app.post("/updatepass/:id", async (req, res, next) => {
    try {
        const person = await Car.findById(req.params.id);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password2, salt);


        const updateperson = await Car.findByIdAndUpdate(person.id, { $set: { password: hash } }, { new: true });
        console.log(updateperson);
        if (updateperson)
            res.status(200).json(updateperson)
        else
            res.status(200).json(0)
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")
        // next(err)
    }

})
app.post("/find/:id", async (req, res, next) => {

    try {
        console.log(req.params.id);
        const person = await Car.findById(req.params.id);
        if (person)
            res.status(200).json(person)
        else
            res.json(0);
    } catch (err) {
        // return next(err); //need to use return
    }
})



app.post("/update/:id", async (req, res, next) => {
    try {

        const updateperson = await Car.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true });
        console.log(updateperson);
        res.status(200).json(updateperson)
    } catch (err) {
        // return next(err);
    }

})

app.post("/upload-image/:id", async (req, res) => {
    // const person = await Car.findById(req.params.id);
    const { base64 } = req.body;
    console.log(base64);
    try {
        // Car.create({ image: base64 });
        const updateperson = await Car.findByIdAndUpdate(req.params.id, { $set: { image: base64 } }, { new: true });
        res.status(200).json();
    }
    catch (err) {
        // return next(err);
    }
})

// app.use((err, req, res, next) => {
//     const errorStatus = err.status || 500;
//     const errorMessage = err.message || "something went wrong";
//     return res.status(errorStatus).json({
//         success: false,
//         status: errorStatus,
//         message: errorMessage
//     });
// })




app.listen(port, () => {

    // connect();
    console.log("connect to backend");
})
