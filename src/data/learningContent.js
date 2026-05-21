export const learningContent = {
  french: [
    {
      level: 1,
      words: [
        { word: 'Bonjour', meaning: 'Hello / Good morning' },
        { word: 'Merci', meaning: 'Thank you' },
        { word: 'S\'il vous plaît', meaning: 'Please' },
        { word: 'Oui', meaning: 'Yes' },
        { word: 'Non', meaning: 'No' },
      ],
      text: "Bonjour! Je m'appelle Alihan. Je suis un étudiant et j'apprends le français. Merci beaucoup!",
      quiz: {
        question: "What does 'S'il vous plaît' mean in English?",
        options: ["Thank you", "Please", "Hello", "Yes"],
        correctIndex: 1
      }
    },
    {
      level: 2,
      words: [
        { word: 'Chat', meaning: 'Cat' },
        { word: 'Chien', meaning: 'Dog' },
        { word: 'Maison', meaning: 'House' },
        { word: 'Voiture', meaning: 'Car' },
        { word: 'Livre', meaning: 'Book' },
      ],
      text: "J'ai un chat et un chien dans ma maison. Je lis un livre dans la voiture.",
      quiz: {
        question: "Which word means 'House'?",
        options: ["Chat", "Voiture", "Maison", "Livre"],
        correctIndex: 2
      }
    }
  ],
  english: [
    {
      level: 1,
      words: [
        { word: 'Achieve', meaning: 'Başarmak, elde etmek' },
        { word: 'Goal', meaning: 'Hedef, amaç' },
        { word: 'Improve', meaning: 'Geliştirmek' },
        { word: 'Skill', meaning: 'Yetenek, beceri' },
        { word: 'Future', meaning: 'Gelecek' },
      ],
      text: "To achieve your goals, you must constantly improve your skills. The future belongs to those who prepare for it today.",
      quiz: {
        question: "Which word means 'Geliştirmek'?",
        options: ["Goal", "Improve", "Achieve", "Skill"],
        correctIndex: 1
      }
    },
    {
      level: 2,
      words: [
        { word: 'Trade', meaning: 'Ticaret' },
        { word: 'International', meaning: 'Uluslararası' },
        { word: 'Business', meaning: 'İş, işletme' },
        { word: 'Market', meaning: 'Pazar, piyasa' },
        { word: 'Strategy', meaning: 'Strateji' },
      ],
      text: "International trade connects businesses across the global market. A good strategy is key to success.",
      quiz: {
        question: "What is the meaning of 'Trade'?",
        options: ["Pazar", "Uluslararası", "İş", "Ticaret"],
        correctIndex: 3
      }
    }
  ],
  software: [
    {
      level: 1,
      words: [
        { word: 'Variable', meaning: 'Data container (let, const)' },
        { word: 'Function', meaning: 'Reusable block of code' },
        { word: 'Array', meaning: 'List of items' },
        { word: 'State', meaning: 'Memory of a component' },
        { word: 'Props', meaning: 'Arguments passed to components' },
      ],
      text: "In React, we use 'State' to keep track of data that changes over time. We pass data down to other components using 'Props'.",
      quiz: {
        question: "Which feature is used to keep track of component memory/data that changes?",
        options: ["Props", "Array", "State", "Function"],
        correctIndex: 2
      }
    },
    {
      level: 2,
      words: [
        { word: 'API', meaning: 'Application Programming Interface' },
        { word: 'JSON', meaning: 'JavaScript Object Notation' },
        { word: 'Async/Await', meaning: 'Handling asynchronous operations' },
        { word: 'Promise', meaning: 'Eventual completion of async task' },
        { word: 'Endpoint', meaning: 'URL where API is accessed' },
      ],
      text: "When fetching data from an API endpoint, we receive a Promise. We use async/await to wait for the JSON response before updating our State.",
      quiz: {
        question: "What format is commonly used to receive data from an API?",
        options: ["HTML", "XML", "JSON", "CSS"],
        correctIndex: 2
      }
    }
  ]
};
