import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Quiz, QuizResult } from "@shared/schema";
import { RefreshCw, Trophy, Star } from "lucide-react";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quiz, isLoading, refetch } = useQuery({
    queryKey: ["/api/quiz/random"],
    queryFn: () => apiClient.request<Quiz>("/api/quiz/random"),
  });

  const submitQuizMutation = useMutation({
    mutationFn: (answers: number[]) => 
      apiClient.request<QuizResult>("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
    onSuccess: (result) => {
      setQuizResult(result);
      setQuizCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Quiz Concluído!",
        description: `Você ganhou ${result.pointsEarned} pontos!`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao enviar quiz. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswers.length === quiz?.questions.length) {
      submitQuizMutation.mutate(selectedAnswers);
    }
  };

  const handleNewQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Erro ao carregar quiz. Tente novamente.</p>
            <Button onClick={() => refetch()} className="mt-4">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Concluído!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {quizResult.score}
                </div>
                <div className="text-sm text-gray-600">Acertos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {quizResult.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {quizResult.pointsEarned}
                </div>
                <div className="text-sm text-gray-600">Pontos</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg">
                {((quizResult.score / quizResult.totalQuestions) * 100).toFixed(0)}% de aproveitamento
              </span>
            </div>

            <div className="space-y-3">
              <Button onClick={handleNewQuiz} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Novo Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <Button onClick={handleNewQuiz} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Novo Quiz
          </Button>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">
            Pergunta {currentQuestion + 1} de {quiz.questions.length}
          </span>
          <Badge variant="outline">
            100 pontos por resposta correta
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
              className="w-full text-left h-auto p-4 justify-start"
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                {option}
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Anterior
        </Button>
        
        <div className="flex space-x-3">
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={selectedAnswers.length !== quiz.questions.length || submitQuizMutation.isPending}
              size="lg"
            >
              {submitQuizMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Finalizar Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              Próxima
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}