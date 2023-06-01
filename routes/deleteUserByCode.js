const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

router.delete('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;

    // Aqui você pode excluir o usuário do banco de dados pelo código
    const deletedUser = await Person.findOneAndDelete({ codigo });

    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;