import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendService, Course, CourseLevel, Flashcard } from '@/services/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState({
    title: '',
    description: '',
    language: '',
    difficulty: 'beginner' as Course['difficulty'],
    isPublic: true,
  });

  const [levels, setLevels] = useState<CourseLevel[]>([
    {
      id: '1',
      name: '',
      items: []
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addLevel = () => {
    const newLevel: CourseLevel = {
      id: Date.now().toString(),
      name: '',
      items: []
    };
    setLevels([...levels, newLevel]);
  };

  const removeLevel = (levelId: string) => {
    if (levels.length > 1) {
      setLevels(levels.filter(level => level.id !== levelId));
    }
  };

  const updateLevel = (levelId: string, name: string) => {
    setLevels(levels.map(level => 
      level.id === levelId ? { ...level, name } : level
    ));
  };

  const addFlashcard = (levelId: string) => {
    const newFlashcard: Flashcard = {
      id: Date.now().toString(),
      sideA: { phrase: '' },
      sideB: { phrase: '' }
    };
    
    setLevels(levels.map(level => 
      level.id === levelId 
        ? { ...level, items: [...level.items, newFlashcard] }
        : level
    ));
  };

  const removeFlashcard = (levelId: string, cardId: string) => {
    setLevels(levels.map(level => 
      level.id === levelId 
        ? { ...level, items: level.items.filter(item => item.id !== cardId) }
        : level
    ));
  };

  const updateFlashcard = (levelId: string, cardId: string, side: 'sideA' | 'sideB', field: 'phrase' | 'exampleSentence', value: string) => {
    setLevels(levels.map(level => 
      level.id === levelId 
        ? {
            ...level, 
            items: level.items.map(item => 
              item.id === cardId 
                ? { ...item, [side]: { ...item[side], [field]: value } }
                : item
            )
          }
        : level
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course.title || !course.language) {
      toast({
        title: "Missing Information",
        description: "Please fill in the course title and language.",
        variant: "destructive",
      });
      return;
    }

    if (levels.some(level => !level.name)) {
      toast({
        title: "Missing Level Names",
        description: "Please provide names for all levels.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newCourse = await backendService.createCourse({
        ...course,
        levels: levels.filter(level => level.items.length > 0)
      });

      toast({
        title: "Course Created",
        description: `Successfully created "${newCourse.title}"`,
      });

      navigate('/courses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent ml-4">
              Create New Course
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder="e.g., Spanish Basics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Input
                    id="language"
                    value={course.language}
                    onChange={(e) => setCourse({ ...course, language: e.target.value })}
                    placeholder="e.g., Spanish"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Describe what students will learn in this course"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={course.difficulty} onValueChange={(value: Course['difficulty']) => setCourse({ ...course, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {levels.map((level, levelIndex) => (
            <Card key={level.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Level {levelIndex + 1}</CardTitle>
                    <CardDescription>Add flashcards for this level</CardDescription>
                  </div>
                  {levels.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeLevel(level.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Level Name *</Label>
                  <Input
                    value={level.name}
                    onChange={(e) => updateLevel(level.id, e.target.value)}
                    placeholder="e.g., Greetings"
                    required
                  />
                </div>

                <div className="space-y-4">
                  {level.items.map((flashcard, cardIndex) => (
                    <div key={flashcard.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Flashcard {cardIndex + 1}</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFlashcard(level.id, flashcard.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Side A - Phrase *</Label>
                          <Input
                            value={flashcard.sideA.phrase}
                            onChange={(e) => updateFlashcard(level.id, flashcard.id, 'sideA', 'phrase', e.target.value)}
                            placeholder="English phrase"
                            required
                          />
                          <Label>Side A - Example (optional)</Label>
                          <Input
                            value={flashcard.sideA.exampleSentence || ''}
                            onChange={(e) => updateFlashcard(level.id, flashcard.id, 'sideA', 'exampleSentence', e.target.value)}
                            placeholder="Example sentence"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Side B - Phrase *</Label>
                          <Input
                            value={flashcard.sideB.phrase}
                            onChange={(e) => updateFlashcard(level.id, flashcard.id, 'sideB', 'phrase', e.target.value)}
                            placeholder="Translation"
                            required
                          />
                          <Label>Side B - Example (optional)</Label>
                          <Input
                            value={flashcard.sideB.exampleSentence || ''}
                            onChange={(e) => updateFlashcard(level.id, flashcard.id, 'sideB', 'exampleSentence', e.target.value)}
                            placeholder="Example sentence"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => addFlashcard(level.id)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flashcard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={addLevel}>
              <Plus className="w-4 h-4 mr-2" />
              Add Level
            </Button>
            
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;