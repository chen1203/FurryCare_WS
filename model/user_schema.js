var mongoose = require('mongoose'); 
var schema = mongoose.Schema;

var userSchema = new schema({
	userName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    pass: {type: String, required: true},
    animals: [
        {
            animalName: {type: String},
            animalAge: {type: Number},
            animalWeight: {type: Number},
            animalPic: {type: String},  
            animalVaccination: [
                {
                    vaccName: {type: String},
                    vaccDate: {type: Date, default: Date.now},
                    vaccExp: {type: Date}
                }
            ],
            animalFood: [
                {
                    foodName: {type: String},
                    foodBrand: {type: String},
                    foodBagWeight: {type: Number},
                    foodBagPrice: {type: Number},
                    foodDailyUsage: {type: Number},
                    foodDate: {type: Date, default: Date.now}
                }
            ],
            animalCare: [
                {
                    careType:  {type: String},
                    careDate: {type: Date, default: Date.now},
                   	careExp:  {type: Date}
                }
            ]
        },
      
    ],
    notifications: [ 
        { 
            animalId : {type: String},
            detailConnectedId : {type: String},
            notiType: {type: String},
            notiName: {type: String, required: true}, 
            notiReceivedDate: {type: Date, default: Date.now, required: true},
            notiExpiredDate: {type: Date, default: Date.now, required: true}
        }
    ]
	}, {collection: 'furrycare'});

mongoose.model('User',userSchema);
