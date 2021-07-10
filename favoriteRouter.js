const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
    Favorite.find({user:req.user._id})
    .populate('user, campsite')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      Favorite.findOne({user:req.user._id})
      .then(favorite => {
          if (favorite) {
              req.body.forEach(fav =>
                {
                    if (!favorite.campsites.includes(fav._id)) {
                        favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then(favorite => {
                    res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
     
    })
    .catch(err => next(err));
} else {
    Favorite.create({user: req.user._id})
    .then(favorite => {
        req.body.forEach(fav => {
            if (!favorite.campsites.includes(fav._id)) {
                favorite.campsites.push(fav._id);
            }
        });
        favorite.save()
        .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}
}).catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,   (req, res) => {
     err = new Error('The operation is not supported');
        err.status = 403;
        return next(err);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOneAndDelete({user:req.user._id})
    .then(favorite => {
        if (favorite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } else {
        res.setHeader('Content-Type', 'text/plain')
        res.end('That campsite is already in the lis of favorites')
    }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,  authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user:req.user._id})
        err = new Error('The operation is not supported');
        err.status = 403;
        return next(err);
    })

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Favorite.findOne({user:req.user._id})
    .then(favorite => {
   if(favorite) {
       if(!favorite.campsites.includes(req.params.campsiteId)) {
           favorite.campsites.push(req.params.campsiteId)
           favorite.save()
         .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));
       } else {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'text/plain');
           res.end('That campsite is already a favorite!');
       }
   } else {
    Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }) 
       
    .catch(err => next(err));
   }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyAdmin, authenticate.verifyAdmin,  (req, res, next) => {
    Favorite.findByIdAndUpdate(req.params.favoriteId, {
        $set: req.body
    }, { new: true })
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions,  authenticate.verifyUser,  authenticate.verifyAdmin,  (req, res, next) => {
    Favorite.findOne({user:req.user._id})
    .then(favorite => {
        if(favorite.campsites.includes(req.params.campsiteId)) {
            findOneAndDelete(favorite.campsites)
            favorite.save()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }       
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no favorites to delete');
    
        }
    }) .catch(err => next(err));
})   
module.exports = favoriteRouter;