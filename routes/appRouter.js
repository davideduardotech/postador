const express = require('express')
const router = express.Router()

const multer  = require('multer');
const path = require('path')
const passport = require('passport');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const User = require('../models/userModel');
const Post = require('../models/postModel');


const {
  dashboard
} = require('../controllers/dashboardCtrl')

const {
  allPosts,
  viewPostPage,

  createPostPage,
  savePost,

  updatePostPage,
  updatePostScheduleLink,
  updatePostScheduleMedia,
  updatePostPublished,

  deletePost
} = require('../controllers/postsCtrl')

const {
  socialAccounts,
  getAccountsInstagram,
  importAccountsInstagram,
  removeAccount
} = require('../controllers/accountsCtrl')

const {
  groups,
  getGroupsAccount,
  saveSelectedGroups,
  removeGroup,
  saveGroupsSet,
  deleteGroupsSet
} = require('../controllers/groupsCtrl')

const {
  pages,
  getPagesAccount,
  saveSelectedPages,
  removePage,
  savePagesSet,
  deletePagesSet
} = require('../controllers/pagesCtrl');

const { 
  settings,
  updateAccount,
  updatePassword
} = require('../controllers/settingsCtrl')


const {
  metrics,
  getDataMetrics,
  users,
  saveUser,
  updateUser,
  deleteUser,
  finances,
  plans,
  updatePlan
} = require('../controllers/adminCtrl')

const { 
  replyComments,
  activeReply,
  disableReply,
  createStandardAnswers,
  deleteStandardAnswers
} = require('../controllers/replyCommentsCtrl');


const {
  authMiddleware,
  isAdmin
} = require('../middlewares/authMiddleware')


// DASHBOARD
router.get("/", authMiddleware, dashboard)



// POSTS ROUTES
router.get("/all-posts", authMiddleware, allPosts)
router.get("/view-post/:id", authMiddleware, viewPostPage)



// NEW/UPDATE POSTS ROUTES
router.get("/create-post", authMiddleware, createPostPage)
router.get("/update-post/:id", authMiddleware, updatePostPage)
router.post("/save-post", authMiddleware, savePost)
router.put("/posts/update-post-schedule-link/:id", authMiddleware, updatePostScheduleLink)
router.put("/posts/update-post-schedule-media/:id", authMiddleware, updatePostScheduleMedia)
router.put("/posts/update-post-published/:id", authMiddleware, updatePostPublished)
router.delete("/posts/delete-post/:id", authMiddleware, deletePost)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirPath = path.join(__dirname, '..', 'public', 'img', 'posts');
    cb(null, dirPath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const filename = randomNumber.toString() + extension;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.post('/posts/upload-image', authMiddleware, upload.single('image'), function (req, res, next) {
  const filePath = path.join(__dirname, '..', 'public', 'img', 'posts', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension;
  const newFilePath = path.join(__dirname, '..', 'public', 'img', 'posts', newFilename);
  
  fs.rename(filePath, newFilePath, function (err) {
    if (err) {
      return next(err);
    }
    res.send(newFilename);
  });
});

router.put('/posts/update-media/:id', authMiddleware, upload.single('image'), function (req, res, next) {
  try {
    const filePath = path.join(__dirname, '..', 'public', 'img', 'posts', req.file.filename);
    const extension = path.extname(req.file.originalname);
    const newRandomNumber = Math.floor(Math.random() * 1000000000);
    const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension;
    const newFilePath = path.join(__dirname, '..', 'public', 'img', 'posts', newFilename);

    fs.rename(filePath, newFilePath, async function (err) {
      if (err) {
        return next(err);
      }

      const findPost = await Post.findById(req.params.id)

      if (findPost.idUser.toString() != req.user._id.toString()) return res.status(500).json({ error: "Você não possui permissão para isso." })

      fs.unlink(path.join(__dirname, '..', 'public', 'img', 'posts', findPost.media), async (err) => {
        if (err) {
          res.status(500).json({ error: "Não foi possível atualizar a imagem" })
        } else {
          const updatePost = await Post.findByIdAndUpdate(req.params.id, {
            media: newFilename,
          }, { new: true })
    
          res.sendStatus(200)
        }
      });
    })
  } catch (err) {
    console.log(err)
  }
});



// GROUPS ROUTES
router.get("/groups", authMiddleware, groups)
router.post("/get-groups-account/:idAccount", authMiddleware, getGroupsAccount)
router.put("/save-selected-groups/:idAccount", authMiddleware, saveSelectedGroups)
router.post("/save-groups-set", authMiddleware, saveGroupsSet)
router.delete("/delete-groups-set", authMiddleware, deleteGroupsSet)
router.delete("/remove-group/:id", authMiddleware, removeGroup)



// PAGES ROUTES
router.get("/pages", authMiddleware, pages);
router.post("/get-pages-account/:idAccount", authMiddleware, getPagesAccount);
router.put("/save-selected-pages/:idAccount", authMiddleware, saveSelectedPages);
router.post("/save-pages-set", authMiddleware, savePagesSet);
router.delete("/delete-pages-set", authMiddleware, deletePagesSet);
router.delete("/remove-page/:id", authMiddleware, removePage);



// IMPORT ACCOUNTS ROUTES
router.get("/social-accounts", authMiddleware, socialAccounts);
router.get('/social-accounts/auth/facebook',
  authMiddleware,
  passport.authenticate('facebook', { scope: ['public_profile', 'email','pages_messaging', 'pages_manage_posts', 'pages_manage_metadata', 'pages_show_list', 'publish_to_groups', 'pages_read_user_content', 'pages_manage_engagement', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish', 'instagram_manage_comments', 'instagram_manage_insights', 'business_management', 'ads_management'] })
);
router.get('/login-facebook',
  authMiddleware,
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'pages_messaging'] })
);
router.get('/social-accounts/auth/facebook/callback',
  authMiddleware,
  passport.authenticate('facebook', {
    failureRedirect: '/auth',
    successRedirect: '/app/social-accounts'
  })
);
router.get("/social-accounts/get-accounts-instagram", authMiddleware, getAccountsInstagram);
router.put("/social-accounts/import-accounts-instagram", authMiddleware, importAccountsInstagram);
router.delete("/social-accounts/remove/:idAccount", authMiddleware, removeAccount);



// REPLY COMMENTS
router.get("/reply-comments", authMiddleware, replyComments)
router.put("/reply-comments/active", authMiddleware, activeReply)
router.put("/reply-comments/disable", authMiddleware, disableReply)
router.put("/reply-comments/create-standard-answers", authMiddleware, createStandardAnswers)
router.delete("/reply-comments/delete-standard-answers", authMiddleware, deleteStandardAnswers)


// CHATBOT ROUTES
router.get('/chatbot',authMiddleware, (req, res, next)=>{
  return res.render('layouts/app/chatbot/chatbot.ejs',{user:req.user});
})


// SETTINGS ROUTES
router.get("/settings", authMiddleware, settings)
router.put("/settings/update-account", authMiddleware, updateAccount)
router.put("/settings/update-password", authMiddleware, updatePassword)

const storagePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/avatars')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const filename = randomNumber.toString() + extension;
    cb(null, filename);
  }
});

const uploadPhoto = multer({ storage: storagePhoto });

router.put('/settings/update-avatar', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
  const filePath = path.join('./public/img/avatars', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension

  fs.rename(filePath, path.join('./public/img/avatars', newFilename), async function (err) {
    if (err) {
      return next(err);
    }

    if (req.user.avatar.length != 0) {
      fs.unlink(`./public/img/avatars/${req.user.avatar}`, (err) => {});
    }
    
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, {
      avatar: newFilename
    })

    res.sendStatus(200)
  });
});



// ##################### //
// ## ADMIN FUNCTIONS ## //
// ##################### //

// Metrics
router.get("/admin/metrics", authMiddleware, isAdmin, metrics)
router.get("/admin/metrics/data", authMiddleware, isAdmin, getDataMetrics)

// Users
router.get("/admin/users", authMiddleware, isAdmin, users)
router.post("/admin/users/save-user", authMiddleware, isAdmin, saveUser)
router.put("/admin/users/update-user/:id", authMiddleware, isAdmin, updateUser)
router.delete("/admin/users/delete-user/:id", authMiddleware, isAdmin, deleteUser)

// Finances
router.get("/admin/finances", authMiddleware, isAdmin, finances)

// Plans
router.get("/admin/plans", authMiddleware, isAdmin, plans)
router.put("/admin/plans/update-plan/:id", authMiddleware, isAdmin, updatePlan)

module.exports = router