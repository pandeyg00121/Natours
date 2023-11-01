const fs=require('fs');
const express=require('express');

const userController=require('./../controllers/userController');


const router =express.Router();
router.use(express.json());

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(  userController.getUser)
    .patch( userController.updateUser)
    .delete( userController.deleteUser);

module.exports=router;