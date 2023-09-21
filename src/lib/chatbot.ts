import { jaccardSimilarity, chunkArray } from '../helpers/jaccard';

type TAnswer = {
  message: string;
  optionsAnswer: {
    [x: string]: string;
  };
};

type TQuestion = {
  question: string;
  answer: string[];
};

type TFlows = {
  flowPriority: number;
  questions: string[];
  answers: TAnswer;
};

class ChatBot {
  // private id: number = 0;
  public flows: TFlows[] = [];
  public questions: TQuestion[] = [];
  constructor() {}

  addFlow(flow: number) {
    this.flows.push({
      flowPriority: flow,
      questions: [],
      answers: { message: '', optionsAnswer: {} },
    });
    return { addQuestion: this.addQuestion.bind(this) };
  }

  addQuestion(questions: string[]) {
    questions.forEach(question => {
      this.flows[this.flows.length - 1].questions.push(question);
    });
    return { addAnswer: this.addAnswer.bind(this) };
  }

  addAnswer(answer: TAnswer) {
    this.flows[this.flows.length - 1].answers = {
      message: answer.message,
      optionsAnswer: {
        ...answer.optionsAnswer,
      },
    };
    const data: {
      [x: string]: (answer: TAnswer) => void;
    } = {};
    for (const key in answer.optionsAnswer) {
      const da = this.addAnswer.bind(this);
      data[key] = da;
    }
    console.log('🚀 ~ file: chatbot.ts:60 ~ ChatBot ~ addAnswer ~ data:', data);
    return data;
  }

  async question(question: string, flowPriority: number) {
    console.log('🚀 ~ user =>', question);
    const flow = this.flows.findIndex(
      flow => flow.flowPriority === flowPriority
    );
    const chunks = chunkArray(this.flows[flow].questions, 2, question);
    const response = await Promise.race(chunks);

    if (response) {
      console.log('🚀 ~ response chatbot =>', this.flows[flow].answers.message);
      Object.entries(this.flows[flow].answers.optionsAnswer).forEach(
        entries => {
          console.log(`🚀 ~ response chatbot => ${entries[0]}). ${entries[1]}`);
        }
      );
    } else {
      console.log('🚀 ~ response chatbot => Lo sentimos...');
    }
    /*
    console.time('performanceQuestion');
    console.timeEnd('performanceQuestion');
    */
  }
}

const bot = new ChatBot();
bot
  .addFlow(1)
  .addQuestion([
    'hola',
    'hola buenas',
    'hola buenos dias',
    'hola buenos tardes',
    'hola buenos noches',
    'buenos dias',
    'buenos tardes',
    'buenos noches',
  ])
  .addAnswer({
    message:
      'Hola usuario soy chatbot un gusto conocerte, en que te puedo ayudar el dia de hoy?',
    optionsAnswer: {
      a: 'quienes somo?',
      b: 'que vendemos?',
      c: 'atencion al cliente',
    },
  })
  .a({
    message: 'somos lo mas kavron',
    optionsAnswer: {
      a: 'volver',
    },
  });
/*
  .b({
    message: 'pura marihuana y coca',
    optionsAnswer: {
      a: 'volver',
    },
  })
  .c({
    message: 'toma nuestro numero te pongo en 4',
    optionsAnswer: {
      a: 'volver',
    },
  });
  */

bot.question('hola, buenas.', 1);
bot.question('a', 1);
