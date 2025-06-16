import { type User, type InsertUser, type Challenge, type Quiz, type QuizQuestion } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
  getQuizzes(): Promise<Quiz[]>;
  getRandomQuiz(): Promise<Quiz>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private quizzes: Quiz[];
  private currentUserId: number;
  private currentChallengeId: number;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.quizzes = [];
    this.currentUserId = 1;
    this.currentChallengeId = 1;
    
    // Adicionar usuários de demonstração
    this.initializeMockData();
  }

  private initializeMockData() {
    // Usuário de demonstração
    const demoUser: User = {
      id: this.currentUserId++,
      username: "demo",
      email: "demo@exemplo.com",
      points: 0,
      completedChallenges: []
    };
    this.users.set(demoUser.id, demoUser);

    // Desafios de demonstração
    const mockChallenges: Omit<Challenge, 'id'>[] = [
      {
        titulo: "Reduzir Consumo de Água",
        descricao: "Reduza o consumo de água em casa por uma semana usando técnicas simples como banhos mais curtos e fechamento de torneiras.",
        nivelDificuldade: "Fácil",
        categoria: "Água",
        pontuacaoMaxima: 100,
        tempoEstimado: 7,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Energia Solar Caseira",
        descricao: "Instale um pequeno sistema de energia solar para carregamento de dispositivos móveis.",
        nivelDificuldade: "Médio",
        categoria: "Energia",
        pontuacaoMaxima: 250,
        tempoEstimado: 30,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Transporte Sustentável",
        descricao: "Use apenas transporte público, bicicleta ou caminhada por uma semana inteira.",
        nivelDificuldade: "Médio",
        categoria: "Transporte",
        pontuacaoMaxima: 200,
        tempoEstimado: 7,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Compostagem Doméstica",
        descricao: "Crie um sistema de compostagem caseira para resíduos orgânicos da cozinha.",
        nivelDificuldade: "Difícil",
        categoria: "Resíduos",
        pontuacaoMaxima: 300,
        tempoEstimado: 14,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Zero Plástico",
        descricao: "Elimine completamente o uso de plástico descartável por um mês.",
        nivelDificuldade: "Difícil",
        categoria: "Resíduos",
        pontuacaoMaxima: 400,
        tempoEstimado: 30,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    mockChallenges.forEach(challenge => {
      const challengeWithId: Challenge = {
        ...challenge,
        id: this.currentChallengeId++
      };
      this.challenges.set(challengeWithId.id, challengeWithId);
    });

    // Quizzes de demonstração
    this.quizzes = [
      {
        id: 1,
        title: "Sustentabilidade Básica",
        questions: [
          {
            id: 1,
            question: "Qual é a principal causa do aquecimento global?",
            options: ["Emissões de gases de efeito estufa", "Buraco na camada de ozônio", "Ciclos solares", "Atividade vulcânica", "Mudanças naturais do clima"],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "Quanto tempo leva para uma garrafa plástica se decompostar na natureza?",
            options: ["1 ano", "10 anos", "50 anos", "450 anos", "100 anos"],
            correctAnswer: 3
          },
          {
            id: 3,
            question: "Qual fonte de energia é considerada mais sustentável?",
            options: ["Carvão", "Petróleo", "Solar", "Gás natural", "Nuclear"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "O que significa ser 'carbono neutro'?",
            options: ["Não usar combustíveis fósseis", "Equilibrar emissões com remoção de CO2", "Usar apenas energia renovável", "Plantar muitas árvores", "Reduzir 50% das emissões"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "Qual atividade doméstica consome mais água?",
            options: ["Lavar louça", "Tomar banho", "Lavar roupa", "Usar vaso sanitário", "Cozinhar"],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 2,
        title: "Energia Renovável",
        questions: [
          {
            id: 6,
            question: "Qual país lidera em capacidade de energia solar instalada?",
            options: ["Estados Unidos", "China", "Alemanha", "Japão", "Brasil"],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "A energia eólica funciona melhor em:",
            options: ["Montanhas", "Desertos", "Costas marítimas", "Florestas", "Cidades"],
            correctAnswer: 2
          },
          {
            id: 8,
            question: "Qual a principal vantagem da energia hidrelétrica?",
            options: ["Baixo custo", "Não gera poluição", "Armazenamento de energia", "Fácil instalação", "Disponível em qualquer lugar"],
            correctAnswer: 2
          },
          {
            id: 9,
            question: "As fontes renováveis representam quantos % da eletricidade mundial em 2023?",
            options: ["15%", "20%", "30%", "40%", "50%"],
            correctAnswer: 2
          },
          {
            id: 10,
            question: "Qual tecnologia permite armazenar energia solar para uso noturno?",
            options: ["Painéis fotovoltaicos", "Baterias", "Turbinas", "Inversores", "Cabos especiais"],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 3,
        title: "Mudanças Climáticas",
        questions: [
          {
            id: 11,
            question: "Em que ano foi assinado o Acordo de Paris?",
            options: ["2015", "2016", "2017", "2018", "2020"],
            correctAnswer: 0
          },
          {
            id: 12,
            question: "Qual é a meta global de aquecimento do Acordo de Paris?",
            options: ["1°C", "1,5°C", "2°C", "2,5°C", "3°C"],
            correctAnswer: 1
          },
          {
            id: 13,
            question: "O que é o 'Dia da Sobrecarga da Terra'?",
            options: ["Dia com mais terremotos", "Quando esgotamos recursos anuais do planeta", "Dia de maior poluição", "Quando há mais tempestades", "Dia de conscientização ambiental"],
            correctAnswer: 1
          },
          {
            id: 14,
            question: "Em 2024, o Dia da Sobrecarga da Terra foi em:",
            options: ["1° de junho", "1° de julho", "1° de agosto", "1° de setembro", "1° de outubro"],
            correctAnswer: 2
          },
          {
            id: 15,
            question: "Quantas vezes mais rápido estamos usando os recursos do planeta?",
            options: ["1,2x", "1,5x", "1,7x", "2x", "2,5x"],
            correctAnswer: 2
          }
        ]
      }
    ];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, points: 0, completedChallenges: [] };
    this.users.set(id, user);
    return user;
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge> {
    const now = new Date().toISOString();
    const newChallenge: Challenge = {
      ...challenge,
      id: this.currentChallengeId++,
      createdAt: now,
      updatedAt: now
    };
    this.challenges.set(newChallenge.id, newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Challenge | undefined> {
    const existing = this.challenges.get(id);
    if (!existing) return undefined;
    
    const updated: Challenge = {
      ...existing,
      ...challenge,
      updatedAt: new Date().toISOString()
    };
    this.challenges.set(id, updated);
    return updated;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getQuizzes(): Promise<Quiz[]> {
    return this.quizzes;
  }

  async getRandomQuiz(): Promise<Quiz> {
    const randomIndex = Math.floor(Math.random() * this.quizzes.length);
    return this.quizzes[randomIndex];
  }
}

export const storage = new MemStorage();
