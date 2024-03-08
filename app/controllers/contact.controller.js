const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if(!req.body?.name){
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Error create contact")
        );
    }
};

exports.findALL = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if(name){
            documents = await contactService.findByName(name);
        }else{
            documents = await contactService.find({});
        }
    }catch (error) {
        return next(
            new ApiError(500, "Error retrieving contact")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length == 0) {
        return next(new ApiError(400, "Data to update can not empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was update successfully" });
    }catch (error) {
        return next(new ApiError(500, `Error update contact with id=${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully" });
    }catch (error) {
        return next(new ApiError(500, `Could not delete contact with id=${req.params.id}`));
    }
};

exports.deleteALL = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletaCount = await contactService.deleteALL();
        return res.send({ 
            message: `${deletaCount} contacts were deleted successfully`
         });
    }catch (error) {
        return next(new ApiError(500, "An error occured while removing all contacts"));
    }
};

exports.findALLFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findALLFavorite();
        return res.send(document);
    }catch (error) {
        return next(new ApiError(500, "An error occured while retrieving favorite contacts"));
    }
}