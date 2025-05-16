import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap } from "./generateSitemap";
import { registerUser, authenticateUser } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  const api = "/api";

  // Subjects endpoints
  app.get(`${api}/subjects`, async (req: Request, res: Response) => {
    try {
      const subjects = await storage.getAllSubjects();

  // Auth endpoints
  app.post(`${api}/auth/register`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const success = await registerUser(email, password, name);
      if (success) {
        res.status(201).json({ message: "User registered successfully" });
      } else {
        res.status(400).json({ message: "Registration failed - user may already exist" });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Internal server error during registration" });
    }
  });

  app.get(`${api}/admin/check`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const cookies = req.headers.cookie;
      if (!cookies) {
        return res.status(401).json({ authenticated: false, message: "No authentication token" });
      }

      // Use your existing auth verification logic here
      const token = cookies.split(';').find(c => c.trim().startsWith('token='));
      if (!token) {
        return res.status(401).json({ authenticated: false, message: "No authentication token" });
      }

      // Verify the token and check if user is admin
      const tokenValue = token.split('=')[1];
      const payload = jwt.verify(tokenValue, JWT_SECRET);
      
      if (payload.role !== 'admin') {
        return res.status(403).json({ authenticated: false, message: "Not authorized" });
      }

      res.status(200).json({ authenticated: true, user: payload });
    } catch (error) {
      res.status(401).json({ authenticated: false, message: "Invalid authentication" });
    }
  });

  app.post(`${api}/auth/login`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      const result = await authenticateUser(email, password);
      if (result) {
        res.json({ token: result.token, role: result.role });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error during login" });
    }
  });


      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subjects" });
    }
  });

  app.get(`${api}/subjects/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const subject = await storage.getSubjectBySlug(slug);

      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.json(subject);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subject" });
    }
  });

  // Articles endpoints
  app.get(`${api}/articles`, async (req: Request, res: Response) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get(`${api}/articles/featured`, async (req: Request, res: Response) => {
    try {
      const featuredArticles = await storage.getFeaturedArticles();
      res.json(featuredArticles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured articles" });
    }
  });

  app.get(`${api}/articles/recent`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const recentArticles = await storage.getRecentArticles(limit);
      res.json(recentArticles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent articles" });
    }
  });

  app.get(`${api}/articles/subject/:subjectId`, async (req: Request, res: Response) => {
    try {
      const subjectId = parseInt(req.params.subjectId);

      if (isNaN(subjectId)) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }

      const subject = await storage.getSubject(subjectId);

      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const articles = await storage.getArticlesBySubject(subjectId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles by subject" });
    }
  });

  app.get(`${api}/articles/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post(`${api}/articles`, async (req: Request, res: Response) => {
    try {
      const article = await storage.createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ message: "Error creating article" });
    }
  });

  app.put(`${api}/articles/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await storage.updateArticle(parseInt(id), req.body);
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error updating article" });
    }
  });

  app.delete(`${api}/articles/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteArticle(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  // Generate initial sitemap
  await generateSitemap();

  // Set up scheduled sitemap generation (every 24 hours)
  setInterval(generateSitemap, 24 * 60 * 60 * 1000);

  const httpServer = createServer(app);
  return httpServer;
}