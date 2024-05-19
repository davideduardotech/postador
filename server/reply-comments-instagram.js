const mongoose = require('mongoose');
const axios = require('axios');

const User = require('../models/userModel')
const Reply = require('../models/replyModel');
const Post = require('../models/postModel')

mongoose.connect('mongodb://127.0.0.1:27017/pluBee', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  let processFinished = true;

  async function findPostsActive() {
    const findPostsActive = await Reply.find({ status: true, 'results.type': 'account-instagram' });

    return findPostsActive
  }

  setInterval(async () => {
    if (!processFinished) {
      return
    }

    processFinished = false;

    const replies = await findPostsActive()

    for (const item of replies) {
      try {
        if (item.contents) {
          const findPost = await Post.findById(item.idPost);

          if (findPost) {
            const findUser = await User.findById(findPost.idUser)

            if (findUser && !findUser.isBlocked) {
              for (const result of findPost.results) {
                if (result.status != "published" || result.type == "group") {
                  continue;
                }

                if (result.type == "account-instagram") {
                  const findInstagramAccount = findUser.accountsIg.find(item => item.idAccount == result.idAccount);

                  if (findInstagramAccount) {
                    const findPage = findUser.pages.find(page => page.idPage == findInstagramAccount.idPage)
                  
                    const mediaId = result.id;
                    const accessToken = findPage.accessToken;

                    const url = `https://graph.facebook.com/v16.0/${mediaId}/comments?access_token=${accessToken}`;

                    const getComments = await axios.get(url);

                    for (const response of getComments.data.data) {
                      const findAnsweredComment = item.answered.find(item => item.idComment == response.id);

                      if (!findAnsweredComment) {
                        if (item.limit === item.answered.length) {
                          await Reply.findByIdAndUpdate(item._id, { status: false });

                          await Post.findByIdAndUpdate(
                            item.idPost,
                            {
                              replyCommentsStatus: false,
                            },
                          );
                        } else {
                          const randomIndex = Math.floor(Math.random() * item.contents.length);
                          const randomContent = item.contents[randomIndex];

                          const responseUrl = `https://graph.facebook.com/v16.0/${response.id}/replies?access_token=${accessToken}`;

                          await axios.post(responseUrl, { message: randomContent });

                          await Reply.findByIdAndUpdate(item._id, {
                            $push: {
                              answered: {
                                idComment: response.id,
                              }
                            }
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          continue
        }
      } catch (err) {
        console.log(err)
        continue
      }
    }

    processFinished = true;
  }, 1000);
});