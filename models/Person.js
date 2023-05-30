const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sobrenome: {
    type: String,
    required: true
  },
  dataNasc: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return !isNaN(Date.parse(value));
      },
      message: 'Data de nascimento inválida, favor inserir no formato DD/MM/YYYY'
    },
    set: function(value) {
      if (typeof value === 'string') {
        const dateParts = value.split('/');
        return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      }
      return value;
    }
  },
  endereco: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String,
    required: true,
    validate: {
        validator: function(value) {
          const phoneRegex = /^\+55\s\d{2}\s9\d{8}$/;
          return phoneRegex.test(value);
        },
        message: 'Número de telefone inválido, favor inserir no formato +55 xx 9xxxxxxxx'
      }
  },
  cidade: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    get: function(value) {
      return value ? 'Ativo' : 'Inativo';
    }
  }
});

personSchema.set('toJSON', { getters: true });

personSchema.pre('save', async function(next) {
  const lastPerson = await this.constructor.findOne({}, 'codigo', { sort: { codigo: -1 } });
  const lastSequenceNumber = lastPerson ? parseInt(lastPerson.codigo.slice(3)) : 0;
  this.codigo = `cod${lastSequenceNumber + 1}`;
  next();
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;


/*Explicacao do regex para o telefone
Nesse exemplo, a expressão regular para validação do número de telefone foi corrigida para o formato "+55 xx 9xxxxxxxx". A expressão regular agora é ^\+55\s\d{2}\s9\d{8}$, onde:

^\+55 corresponde ao código do país Brasil (+55).
\s corresponde a um espaço em branco.
\d{2} corresponde a dois dígitos para o código DDD do estado.
\s corresponde a outro espaço em branco.
9\d{8} corresponde a um dígito "9" seguido de oito dígitos para o número de telefone.
*/