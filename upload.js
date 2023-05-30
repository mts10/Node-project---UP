//nessa pagina foram gastas algumas horas e muita sanidade mental.

const express = require('express');
const multer = require('multer');

const router = express.Router();

// Configurar o armazenamento do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    // Gerar um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Configurar o middleware do multer para processar o upload
const upload = multer({ storage: storage });

// Rota para lidar com a solicitação de upload de imagem
router.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  // O arquivo foi enviado com sucesso
  // Você pode acessar os detalhes do arquivo através de req.file
  const fileDetails = {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path
  };

  res.json({ success: true, file: fileDetails });
});

module.exports = router;


