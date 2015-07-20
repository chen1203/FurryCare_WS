var userRoutes = require('../controller/user.js');
var animalRoutes = require('../controller/animal.js');
var notificationRoutes = require('../controller/notification.js');

module.exports = function(app){
	/* user routes */
    app.get('/getUser', userRoutes.getUser);
    /* notification routes */
    app.get('/addNewNoti',notificationRoutes.addNewNotification);
    app.get('/deleteNotiById',notificationRoutes.deleteNotificationByNotiId);
    /* animal routes*/
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