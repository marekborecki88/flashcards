import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { backendService, Course, Flashcard, UserProgress } from '@/services/backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Learn: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourseAndProgress = async () => {
      if (!courseId || !user) return;

      try {
        const [courseData, userProgress] = await Promise.all([
          backendService.getCourse(courseId),
          backendService.getUserProgress(user.id, courseId)
        ]);

        if (!courseData) {
          toast({
            title: "Course not found",
            description: "The requested course could not be found.",
            variant: "destructive",
          });
          navigate('/courses');
          return;
        }

        setCourse(courseData);
        setProgress(userProgress);

        // Set initial card
        if (courseData.levels.length > 0 && courseData.levels[0].items.length > 0) {
          setCurrentFlashcard(courseData.levels[0].items[0]);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
        toast({
          title: "Error",
          description: "Failed to load course data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseAndProgress();
  }, [courseId, user, navigate, toast]);

  const getTotalCards = () => {
    if (!course) return 0;
    return course.levels.reduce((total, level) => total + level.items.length, 0);
  };

  const getCurrentCardNumber = () => {
    if (!course) return 0;
    let cardNumber = 0;
    for (let i = 0; i < currentLevelIndex; i++) {
      cardNumber += course.levels[i].items.length;
    }
    return cardNumber + currentCardIndex + 1;
  };

  const handleAnswer = async (correct: boolean) => {
    if (!course || !user || !currentFlashcard) return;

    try {
      // Update progress
      const newProgress = progress || {
        userId: user.id,
        courseId: course.id,
        flashcardsLearned: 0,
        repetitionsDone: 0,
        currentLevel: 0,
        lastAccessed: new Date()
      };

      newProgress.repetitionsDone += 1;
      if (correct) {
        newProgress.flashcardsLearned += 1;
      }

      await backendService.updateUserProgress(newProgress);
      setProgress(newProgress);

      // Move to next card
      moveToNextCard();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const moveToNextCard = () => {
    if (!course) return;

    const currentLevel = course.levels[currentLevelIndex];
    if (currentCardIndex < currentLevel.items.length - 1) {
      // Next card in current level
      const nextIndex = currentCardIndex + 1;
      setCurrentCardIndex(nextIndex);
      setCurrentFlashcard(currentLevel.items[nextIndex]);
    } else if (currentLevelIndex < course.levels.length - 1) {
      // First card of next level
      const nextLevelIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextLevelIndex);
      setCurrentCardIndex(0);
      setCurrentFlashcard(course.levels[nextLevelIndex].items[0]);
    } else {
      // Course completed
      toast({
        title: "Congratulations!",
        description: "You've completed this course!",
      });
      navigate('/courses');
      return;
    }

    setShowAnswer(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center">
        <div className="text-lg">Loading course...</div>
      </div>
    );
  }

  if (!course || !currentFlashcard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Course not available</h2>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = (getCurrentCardNumber() / getTotalCards()) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Level: {course.levels[currentLevelIndex]?.name}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {getCurrentCardNumber()} / {getTotalCards()}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Progress: {Math.round(progressPercentage)}%
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Card className="w-full max-w-2xl min-h-[400px] flex flex-col justify-center bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-elegant">
            <CardContent className="p-8 text-center">
              {!showAnswer ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-primary">
                    {currentFlashcard.sideA.phrase}
                  </h2>
                  {currentFlashcard.sideA.exampleSentence && (
                    <p className="text-lg text-muted-foreground italic">
                      "{currentFlashcard.sideA.exampleSentence}"
                    </p>
                  )}
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    className="mt-8"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Show Answer
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-secondary">
                      {currentFlashcard.sideB.phrase}
                    </h2>
                    {currentFlashcard.sideB.exampleSentence && (
                      <p className="text-lg text-muted-foreground italic">
                        "{currentFlashcard.sideB.exampleSentence}"
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-4">
                      How well did you know this?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => handleAnswer(false)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4 text-destructive" />
                        Again
                      </Button>
                      <Button 
                        onClick={() => handleAnswer(true)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Good
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {progress && (
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Cards learned: {progress.flashcardsLearned}</span>
              <span>Repetitions: {progress.repetitionsDone}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Learn;