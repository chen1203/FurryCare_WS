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
            animalPic: {type: String},  //add default
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
            animalVaccination: [
                {
                    vaccName: {type: String},
                    vaccDate: {type: Date, default: Date.now},
                    vaccExp: {type: Date}
                }
            ],
            animalCare: [
                {
                    careType:  {type: String},
                    careDate: {type: Date, default: Date.now},
                   	careExp:  {type: Date}
                }
            ],
            animalService: [
                {
                    serviceName: {type: String},
                    serviceType: {type: String},
                    serviceAddress: {type: String}
                }
            ],
            animalMunicipalLicensing: {type: Date, default: Date.now}
        },
      
    ],
    notifications: [ 
        { 
            animalId : {type: String},
            notiType: {type: String},
            notiName: {type: String, required: true}, 
            notiReceivedDate: {type: Date, required: true},
            notiExpiredDate: {type: Date, required: true}
        }
    ]

	}, {collection: 'furrycare'});

mongoose.model('User',userSchema);
//exports.userSchema = userSchema;
