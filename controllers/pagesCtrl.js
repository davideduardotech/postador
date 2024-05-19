const asyncHandler = require('express-async-handler')
const axios = require('axios')

const User = require('../models/userModel')
const Plan = require('../models/planModel')

const pages = asyncHandler(async (req, res) => {
  let sets = []

  const findPlan = await Plan.findOne({title: req.user.plan})

  if (req.user.pagesSets.length > 0) {
    for (const set of req.user.pagesSets) {
      const setObj = {name: set.name, pages: []}

      set.pages.forEach(page => {
        const findPage = req.user.pages.find(item => item.idPage == page.idPage)

        if (findPage) {
          page.name = findPage.name,
          page.description = findPage.description,
          page.photo = findPage.photo

          setObj.pages.push(findPage)
        }
      })

      sets.push(set)
    }
  }

  res.render('layouts/app/pages', { user: req.user, sets: sets, plan: findPlan })
})

const getPageImage = async (page) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v16.0/${page.id}/picture?redirect=false&type=large&access_token=${page.access_token}`);
    return response.data.data.url;
  } catch (error) {
    return null;
  }
};

const getPagesAccount = asyncHandler(async (req, res) => {
  try {
    const { idAccount } = req.params;
    const account = req.user.accountsFb.find(acc => acc.idAccount == idAccount);
    const { accessToken } = account;

    if (!accessToken) {
      return res.status(500).json({ error: "Importe a conta e tente novamente" });
    }

    const requestUrl = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
    
    const { data: { data: results } } = await axios.get(requestUrl);

    const pages = []

    for (const page of results) {
      const pageImage = await getPageImage(page);

      const pageInfo = {
        idPage: page.id,
        idAccount: account.idAccount,
        name: page.name,
      };

      if (pageImage) {
        pageInfo.photo = pageImage;
      }

      pages.push(pageInfo);
    }

    res.status(200).json({results: pages})
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const saveSelectedPages = asyncHandler(async (req, res) => {
  try {
    const { idAccount } = req.params;
    const account = req.user.accountsFb.find(acc => acc.idAccount == idAccount);
    const { accessToken } = account;

    if (!req.user.isAdmin) {
      const findPlan = await Plan.findOne({title: req.user.plan})

      if (findPlan.quantityPages == req.user.pages.length) {
        return res.status(500).json({ error: "Limite de páginas atingido" })
      }

      if (req.body.pages.length > (findPlan.quantityPages - req.user.pages.length)) {
        return res.status(500).json({ error: "Limite de páginas atingido" })
      }
    }

    if (!accessToken) {
      return res.status(500).json({ error: "Importe a conta e tente novamente" });
    }

    const requestUrl = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
    
    const { data: { data: results } } = await axios.get(requestUrl);

    const pages = req.user.pages

    for (const page of results) {
      const isSelected = req.body.pages.find(item => item.id == page.id)
      
      if (isSelected) {
        const pageImage = await getPageImage(page);

        const findPage = pages.find(item => item.idPage == page.id)
  
        if (!findPage) {
          const pageInfo = {
            idPage: page.id,
            idAccount: account.idAccount,
            name: page.name,
            description: (page.hasOwnProperty('description')) ? page.description : "",
            accessToken: page.access_token
          };
    
          if (pageImage) {
            pageInfo.photo = pageImage;
          }
    
          pages.push(pageInfo);
        }
      }
    }

    const insertPages = await User.findByIdAndUpdate(req.user._id,
      { pages: pages },
      { new: true }
    );

    if (insertPages) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Tente novamente mais tarde" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const removePage = asyncHandler(async (req, res) => {
  try {
    const deletePage = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        pages: {
          idPage: req.params.id
        }
      }
    });

    if (deletePage) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Tente novamente mais tarde" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const savePagesSet = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      const findPlan = await Plan.findOne({title: req.user.plan})

      if (findPlan.quantitySets == req.user.pagesSets.length) {
        return res.status(500).json({ error: "Limite de conjuntos de páginas atingido" })
      }
    }

    const findSet = req.user.pagesSets.find(set => set.name == req.body.name)

    if (!findSet) {
      const saveSet = await User.findByIdAndUpdate(req.user._id, {
        $push: {
          pagesSets: {
            name: req.body.name,
            pages: req.body.pages
          }
        }
      });
  
      if (saveSet) {
        res.sendStatus(200)
      } else {
        res.status(500).json({ error: "Tente novamente mais tarde" })
      }
    } else {
      res.status(500).json({ error: "Nome do conjunto já existente" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const deletePagesSet = asyncHandler(async (req, res) => {
  try {
    const deleteSet = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        pagesSets: {
          name: req.body.name
        }
      }
    });

    if (deleteSet) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Tente novamente mais tarde" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

module.exports =
{
  pages,
  getPagesAccount,
  saveSelectedPages,
  removePage,
  savePagesSet,
  deletePagesSet
}