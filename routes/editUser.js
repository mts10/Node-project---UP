const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

router.put('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const updates = req.body;

    // Aqui você pode atualizar as informações pessoais do usuário no banco de dados
    const updatedUser = await Person.findOneAndUpdate({ codigo }, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;