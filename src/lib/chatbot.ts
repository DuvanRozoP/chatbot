type TAnswer = {
  [x: string]: {
    id: number;
    frgQuestion: number;
    answer: string;
  };
};

type TQuestion = {
  question: string;
  answer: string[];
};

type TFlows = {
  flowPriority: number;
  questions: string[];
  answers: string;
};

function dividirArrayEnPartes(arr: TFlows[], numPartes: number) {
  const tamanoParte = Math.ceil(arr.length / numPartes);
  const partes = [];
  for (let i = 0; i < arr.length; i += tamanoParte) {
    partes.push(arr.slice(i, i + tamanoParte));
  }
  return partes;
}

function jaccardSimilarity(str1: string, str2: string) {
  const set1 = new Set(str1.split(''));
  const set2 = new Set(str2.split(''));

  const intersection = new Set([...set1].filter(element => set2.has(element)));
  const union = new Set([...set1, ...set2]);

  const similarity = intersection.size / union.size;

  return similarity * 100;
}

function buscarEnPartes(arr: TFlows[], valor: string) {
  const partes = dividirArrayEnPartes(arr, 3); // Divide el array en 3 partes
  console.log('🚀 ~ file: chatbot.ts:43 ~ buscarEnPartes ~ partes:', partes);
  const promesas = partes.map(parte => {
    return new Promise(resolve => {
      const indice = parte.findIndex(elemento => {
        //jaccardSimilarity(elemento, valor) >= 60
        return elemento;
      });

      if (indice !== -1) {
        console.log(
          '🚀 ~ file: chatbot.ts:58 ~ promesas ~ parte[indice]:',
          parte
        );
        resolve(parte[indice]); // Resuelve con el valor encontrado
      } else {
        resolve(null); // Resuelve con null si no se encuentra el valor
      }
    });
  });

  return Promise.all(promesas).then(resultados => {
    // Encuentra el primer valor no nulo en los resultados
    const valorEncontrado = resultados.find(resultado => resultado !== null);
    return valorEncontrado !== undefined
      ? valorEncontrado
      : 'Valor no encontrado';
  });
}

class ChatBot {
  private id: number = 0;
  public flows: TFlows[] = [];
  public questions: TQuestion[] = [];
  constructor() {}

  addFlow(flow: number) {
    this.flows.push({
      flowPriority: flow,
      questions: [],
      answers: '',
    });
    return {
      addQuestion: (questions: string[]) => {
        return this.addQuestion(questions);
      },
    };
  }

  addQuestion(questions: string[]) {
    questions.forEach(question => {
      this.flows[this.flows.length - 1].questions.push(question);
    });
    return {
      addAnswer: (answer: string) => {
        this.flows[this.flows.length - 1].answers = answer;
      },
    };
  }

  async question(question: string, priority: number) {
    const result = await buscarEnPartes(this.flows, question);
    console.log(
      '🚀 ~ file: chatbot.ts:102 ~ ChatBot ~ question ~ result:',
      result
    );

    /*
    console.log(
      '🚀 ~ file: chatbot.ts:85 ~ ChatBot ~ question ~ result:',
      result
    );
    if (result === null) return 'nose encontro';
    if (typeof result === 'string') return result;
    console.log((result as TQuestion).answer[0]);
    */
  }
}

const bot = new ChatBot();
//bot.addFlow(1).addQuestion('hola')?.addAnswer('hola soy chatbot');
//bot.addFlow(2).addQuestion(['hola', 'hola buenas tardes', 'hola buenos dias']);
bot
  .addFlow(1)
  .addQuestion([
    'hola',
    'hola buenas dias',
    'hola buenas tardes',
    'hola buenas noches',
  ])
  .addAnswer('hola soy ChatBot');
bot
  .addFlow(1)
  .addQuestion([
    'hola',
    'hola buenas dias',
    'hola buenas tardes',
    'hola buenas noches',
  ])
  .addAnswer('hola soy ChatBot');

bot.question('hola, buenas.', 1);

/*
bot.addQuestion('hola').addAnswer('Un gusto un Chatbot');
bot.addQuestion('hola buenas').addAnswer('Un gusto un Chatbot');
bot.addQuestion('buenas tardes').addAnswer('hola, buenas tardes soy Chatbot');
bot.addQuestion('buenas noches').addAnswer('hola, buenas noches soy Chatbot');
bot.addQuestion('buenas dias').addAnswer('hola, buenas dias soy Chatbot');
*/
