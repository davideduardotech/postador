const asyncHandler = require('express-async-handler')
const axios = require('axios')

const User = require('../models/userModel')
const Plan = require('../models/planModel')

const groups = asyncHandler(async (req, res) => {
  const findPlan = await Plan.findOne({title: req.user.plan})

  let sets = []

  if (req.user.groupsSets.length > 0) {
    for (const set of req.user.groupsSets) {
      const setObj = {name: set.name, groups: []}

      set.groups.forEach(group => {
        const findGroup = req.user.groups.find(item => item.idGroup == group.idGroup)

        if (findGroup) {
          group.name = findGroup.name,
          group.description = findGroup.description,
          group.photo = findGroup.photo

          setObj.groups.push(findGroup)
        }
      })

      sets.push(setObj)
    }
  }

  res.render('layouts/app/groups', { user: req.user, sets: sets, plan: findPlan })
})

const getGroupDetails = async (group, idAccount, accessToken) => {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v16.0/${group.id}?fields=name,description,cover&access_token=${accessToken}`);

    const baseGroup = {
      name: data.name,
      idGroup: data.id,
      idAccount: idAccount,
      description: (data.hasOwnProperty('description')) ? data.description : "",
      photo: (data.hasOwnProperty('cover')) ? data.cover.source : "",
    };

    return baseGroup;
  } catch (error) {
    console.log(error)
    return false
  }
};

const getGroupsAccount = asyncHandler(async (req, res) => {
  try {
    const { idAccount } = req.params;
    const account = req.user.accountsFb.find(acc => acc.idAccount == idAccount);
    const { accessToken } = account;

    if (!accessToken) {
      return res.status(500).json({ error: "Importe a conta e tente novamente" });
    }

    const { data: { data: groups } } = await axios.get(`https://graph.facebook.com/v16.0/me/groups?access_token=${accessToken}&fields=privacy,name,icon,description,id`);

    const groupRequests = groups.map(group => getGroupDetails(group, account.idAccount, accessToken));
    const results = await Promise.all(groupRequests);

    res.status(200).json({ results: results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const saveSelectedGroups = asyncHandler(async (req, res) => {
  try {
    const { idAccount } = req.params;
    const account = req.user.accountsFb.find(acc => acc.idAccount == idAccount);
    const { accessToken } = account;

    if (!req.user.isAdmin) {
      const findPlan = await Plan.findOne({title: req.user.plan})

      if (findPlan.quantityGroups == req.user.groups.length) {
        return res.status(500).json({ error: "Limite de grupos atingido" })
      }

      if (req.body.groups.length > (findPlan.quantityGroups - req.user.groups.length)) {
        return res.status(500).json({ error: "Limite de grupos atingido" })
      }
    }

    if (!accessToken) {
      return res.status(500).json({ error: "Importe a conta e tente novamente" });
    }

    const groupRequests = req.body.groups.map(group => getGroupDetails(group, account.idAccount, accessToken));
    const results = await Promise.all(groupRequests);

    const updateGroups = req.user.groups;

    for (const group of results) {
      const findGroup = updateGroups.find(item => item.idGroup == group.idGroup)

      if (!findGroup) {
        updateGroups.push(group)
      }
    }

    const insertGroups = await User.findByIdAndUpdate(req.user._id, {
      groups: updateGroups.map(group => ({
        idGroup: (group.id == null) ? group.idGroup : group.id,
        name: group.name,
        photo: group.photo,
        description: group.description,
        idAccount: (group.idAccount == null) ? account.idAccount : group.idAccount
      }))
    }, { upsert: true });

    if (insertGroups) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Tente novamente mais tarde" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const removeGroup = asyncHandler(async (req, res) => {
  try {
    const deleteGroup = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        groups: {
          idGroup: req.params.id
        }
      }
    });

    if (deleteGroup) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Tente novamente mais tarde" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
});

const saveGroupsSet = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      const findPlan = await Plan.findOne({title: req.user.plan})

      if (findPlan.quantitySets == req.user.groupsSets.length) {
        return res.status(500).json({ error: "Limite de conjuntos de grupos atingido" })
      }
    }

    const findSet = req.user.groupsSets.find(set => set.name == req.body.name)

    if (!findSet) {
      const saveSet = await User.findByIdAndUpdate(req.user._id, {
        $push: {
          groupsSets: {
            name: req.body.name,
            groups: req.body.groups
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

const deleteGroupsSet = asyncHandler(async (req, res) => {
  try {
    const deleteSet = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        groupsSets: {
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
  groups,
  getGroupsAccount,
  saveSelectedGroups,
  removeGroup,
  saveGroupsSet,
  deleteGroupsSet
}