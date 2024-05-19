const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    name:{type: String, default:""},
    page:{type: Object, default:{
        account:{},
        page:{}
    }},
    status:{type: String,default:"desligado"},
    flowchart:{type: Object,default:{trigger:{},children:{}}}
},{
    timestamps:true
})

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

module.exports = Chatbot;