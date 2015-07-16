
var userRoutes = require('../controller/user.js');
var animalRoutes = require('../controller/animal.js');
var notificationRoutes = require('../controller/notification.js');


module.exports = function(app){
	/* user */
    app.get('/getUser', userRoutes.getUser);
    /* notification */
    app.get('/addNewNoti',notificationRoutes.addNewNotification);
    app.get('/deleteNoti',notificationRoutes.deleteNotification);
    /* animal */
    app.get('/setAnimalField',animalRoutes.setAnimalField);
    app.get('/setNewAnimal',animalRoutes.setNewAnimal);
    app.get('/deleteAnimal',animalRoutes.deleteAnimal);
    app.get('/addNewFood',animalRoutes.addNewFood);
    app.get('/addNewVacc',animalRoutes.addNewVacc);
    app.get('/addNewCare',animalRoutes.addNewCare);

    app.get('/deleteItemComplexDetail',animalRoutes.deleteItemComplexDetail);


    app.param('app',app);
    app.post('/uploadImg',animalRoutes.uploadAnimalImg);


};