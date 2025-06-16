import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, challengeSchema, type Challenge } from "@shared/schema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// JWT Authentication Middleware
interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};



export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (no authentication required)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, username: user.username, message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Para demonstração, aceitar qualquer login válido
      // Se usuário não existe, criar automaticamente
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.createUser({
          username: username,
          email: `${username}@demo.com`,
          password: password
        });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, username: user.username, message: "Login successful" });
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Challenge routes (authentication required)
  app.get("/api/desafios", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  app.get("/api/desafios/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge" });
    }
  });

  app.post("/api/desafios", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const challengeData = challengeSchema.parse(req.body);
      
      const challengeToCreate = {
        titulo: challengeData.titulo,
        descricao: challengeData.descricao || "",
        nivelDificuldade: challengeData.nivelDificuldade || "",
        categoria: challengeData.categoria || "",
        pontuacaoMaxima: challengeData.pontuacaoMaxima || 0,
        tempoEstimado: challengeData.tempoEstimado || 0,
        statusAtivo: true
      };
      
      const newChallenge = await storage.createChallenge(challengeToCreate);
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.put("/api/desafios/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const challengeData = challengeSchema.parse(req.body);
      
      const updateData = {
        titulo: challengeData.titulo,
        descricao: challengeData.descricao,
        nivelDificuldade: challengeData.nivelDificuldade,
        categoria: challengeData.categoria,
        pontuacaoMaxima: challengeData.pontuacaoMaxima,
        tempoEstimado: challengeData.tempoEstimado
      };
      
      const updatedChallenge = await storage.updateChallenge(id, updateData);
      if (!updatedChallenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.delete("/api/desafios/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteChallenge(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting challenge" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/random", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const quiz = await storage.getRandomQuiz();
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz" });
    }
  });

  app.post("/api/quiz/submit", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { answers } = req.body;
      const quiz = await storage.getRandomQuiz();
      
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          score++;
        }
      });

      const pointsEarned = score * 100;
      
      // Update user points
      const user = await storage.getUser(req.userId!);
      if (user) {
        await storage.updateUser(req.userId!, { 
          points: user.points + pointsEarned 
        });
      }

      res.json({
        score,
        totalQuestions: quiz.questions.length,
        pointsEarned
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting quiz" });
    }
  });

  // Complete challenge
  app.post("/api/desafios/:id/complete", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await storage.getChallenge(challengeId);
      const user = await storage.getUser(req.userId!);
      
      if (!challenge || !user) {
        return res.status(404).json({ message: "Challenge or user not found" });
      }

      if (user.completedChallenges.includes(challengeId)) {
        return res.status(400).json({ message: "Challenge already completed" });
      }

      // Update user with completed challenge and points
      await storage.updateUser(req.userId!, {
        points: user.points + challenge.pontuacaoMaxima,
        completedChallenges: [...user.completedChallenges, challengeId]
      });

      res.json({ 
        message: "Challenge completed successfully",
        pointsEarned: challenge.pontuacaoMaxima
      });
    } catch (error) {
      res.status(500).json({ message: "Error completing challenge" });
    }
  });

  // Get user profile with points
  app.get("/api/user/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        completedChallenges: user.completedChallenges.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
