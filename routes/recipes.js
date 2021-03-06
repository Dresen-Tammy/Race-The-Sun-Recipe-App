const express = require('express');
// custom module that has all the logic of server
const dbAccess = require('../dbAccess.js');
var router = express.Router();


// checks if logged in. If so get favorites, if not, delivers login page.
router.get('/getFavorites', function(req,res) {
    console.log('getting favorites');
    var chef_id = req.session.chef_id;
    console.log(chef_id);
    dbAccess.getFavoritesFromDb(chef_id, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({success:false, message: "Error getting favorites"});

        }
        else {

            res.json(result.rows);
        }
    });
});

// Adds favorite to db
router.post('/addFavorite', function(req, res, next) {
    // get info
    console.log(req.body.recipe_id);
    recipe_id = req.body.recipe_id;
    console.log(req.body.image_url);
    // check if in favs
    console.log("Check in favs")
    dbAccess.getFavoriteByTitle(req.session.chef_id, recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message:"Error checking favorite in db."});
        } else if (result[0] !== undefined) {
            console.log("already in favorites");
            res.json({success: true, message: "Already in Favorites", recipe_id: req.body.recipe_id});
        } else {
            next();
        } 
    });
});
router.post('/addFavorite', function(req, res, next) {
    // check if in recipes.  If yes, next, if no, add to recipes
    console.log("next check in recipes");
    recipe_id = req.body.recipe_id;
    dbAccess.getRecipeFromDb(recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "error checking if in recipes."});
        } else if (result[0] !== undefined) {
            console.log("already in database");
            next();
        } else {
            console.log("not in recipes");
            dbAccess.setRecipeInDb(req.body.recipe_id, req.body.title, req.body.image_url, function(err, result) {
                if (err) {
                    res.status(500).json({success: false, message: "Error adding to recipes"});
                } else {
                    next();
                }
            });
        }
    });
});
router.post('/addFavorite', function(req, res, next) {
    console.log("Add to favorites");
    // add to favorite
    dbAccess.setFavoriteInDb(req.body.recipe_id, req.session.chef_id, function(err,result) {
        if (err) {
            res.status(500).json({success: false, message: "Error adding to favorite"});
        } else {
            res.json({success: true, recipe_id: req.body.recipe_id});
        }
    })
})


// deletes favorite from db
router.delete('/deleteFavorite', function (req, res, next) {
    const recipe_id = req.body.recipe_id;
    // check if in favoriites
    console.log("Check if in favorites");
    dbAccess.getFavoriteByTitle(req.session.chef_id, recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success: false, message: "Error checking in favorites"});
        } else if (result[0] !== undefined) {
            next();
        } else {
            res.json({success: false, message: "Recipe is not in favorites"});
        }
    })
})
router.delete('/deleteFavorite', function (req, res, next) {
    dbAccess.deleteFavoriteFromDb(req.session.chef_id, req.body.recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success: false, message: "Error deleting from favorites"});
        } else {
            res.json({success: true, recipe_id: req.body.recipe_id});
            //next();
        }
    })
})
router.delete('/deleteFavorite', function(req, res, next) {
    console.log("getting favorites");
    dbAccess.getFavoritesFromDb(req.session.chef_id, function (err, result) {
        if (err) {
            res.status(500).json({success: false, message: "Error getting new favorites"});
        } else {
            res.json(result.rows);
        }
    })
})
// deletes favorite from db when in search result
router.delete('/deleteFavoriteSearch', function (req, res, next) {
    const recipe_id = req.body.recipe_id;
    // check if in favoriites
    console.log("Check if in favorites");
    dbAccess.getFavoriteByTitle(req.session.chef_id, recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success: false, message: "Error checking in favorites"});
        } else if (result[0] !== undefined) {
            next();
        } else {
            res.json({success: false, message: "Recipe is not in favorites"});
        }
    })
})
router.delete('/deleteFavoriteSearch', function (req, res, next) {
    dbAccess.deleteFavoriteFromDb(req.session.chef_id, req.body.recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success: false, message: "Error deleting from favorites"});
        } else {
            res.json({success: true, recipe_id: req.body.recipe_id});
        }
    })
})
router.get('/allRecipes',  function(req, res) {
    console.log("in logic");
    dbAccess.getAllRecipesFromDb(function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "Error getting recipes from database"})
        } else {
            res.json(result);
        }
    })
})



module.exports = router;