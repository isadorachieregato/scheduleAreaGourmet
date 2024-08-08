const router = require('express').Router();
const userController = require('../controller/userController');
const areaController = require('../controller/areaController');
const BookingController = require('../controller/bookingController');

// Rotas para operações relacionadas a usuários
// Rota para cadastrar um novo usuário
router.post('/cadastro/', userController.postUser);
// Rota para obter informações de um usuário específico
router.get('/getuser/', userController.getUser);
// Rota para atualizar informações de um usuário existente
router.put('/updateuser/', userController.putUser);
// Rota para deletar um usuário existente
router.delete('/deleteuser/', userController.deleteUser);

// Rotas para operações de login
// Rota para login de usuário (deve ser definida no controlador)
router.get('/login/', userController.Login);
// Rota para verificar o login de um usuário
router.get('/getlogin/', userController.getLogin);

// Rotas para operações relacionadas a áreas gourmet
// Rota para cadastrar uma nova área gourmet
router.post('/areapost/', areaController.postArea);
// Rota para obter informações de todas as áreas gourmet
router.get('/areaget/', areaController.getAreas);
// Rota para obter informações de uma área gourmet específica pelo nome
router.get('/areagetName', areaController.getAreaByName);
// Rota para atualizar informações de uma área gourmet existente
router.put('/areaput/', areaController.putArea);
// Rota para deletar uma área gourmet existente
router.delete('/areadel/', areaController.deleteArea);

// Rotas para operações relacionadas a reservas
// Rota para criar uma nova reserva
router.post('/booking', BookingController.createBooking);
// Rota para obter informações de todas as reservas
router.get('/getAllBookings', BookingController.getAllBookings);
// Rota para obter informações de reservas por email
router.get('/getBookingEmail/:email', BookingController.getBooking);
// Rota para atualizar informações de uma reserva existente
router.put('/bookingput/', BookingController.putBooking);
// Rota para deletar uma reserva existente
router.delete('/booking/:ID_booking', BookingController.deleteBooking);

module.exports = router;
