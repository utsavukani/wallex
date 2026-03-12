import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    BookOpen,
    Trophy,
    Star,
    CheckCircle,
    Play,
    Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isCompleted: boolean;
    segment: string[];
}

interface Quiz {
    id: string;
    title: string;
    questions: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isCompleted: boolean;
    score?: number;
}

interface Challenge {
    id: string;
    title: string;
    description: string;
    duration: string;
    reward: string;
    isActive: boolean;
    progress: number;
}

const EducationPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'articles' | 'quizzes' | 'challenges'>('articles');
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [showArticleReader, setShowArticleReader] = useState(false);

    // Persistent state (localStorage)
    const [completedArticleIds, setCompletedArticleIds] = useState<Set<string>>(new Set());
    const [quizResults, setQuizResults] = useState<Record<string, { score: number; completed: boolean }>>({});
    const [notesByArticle, setNotesByArticle] = useState<Record<string, string>>({});
    const [favoriteArticleIds, setFavoriteArticleIds] = useState<Set<string>>(new Set());
    const [challengeProgressById, setChallengeProgressById] = useState<Record<string, number>>({});
    const [draftNote, setDraftNote] = useState<string>('');

    // Sample data
    const articles: Article[] = [
        {
            id: '1',
            title: 'What is an Emergency Fund?',
            excerpt: 'Learn why having an emergency fund is crucial for financial security and how to build one.',
            category: 'Savings',
            readTime: 3,
            difficulty: 'beginner',
            isCompleted: false,
            segment: ['low-income', 'budget-conscious', 'mid-earner', 'high-earner']
        },
        {
            id: '2',
            title: 'Understanding Compound Interest',
            excerpt: 'Discover how compound interest can work for you and help grow your savings over time.',
            category: 'Investing',
            readTime: 5,
            difficulty: 'intermediate',
            isCompleted: false,
            segment: ['mid-earner', 'high-earner']
        },
        {
            id: '3',
            title: 'Budgeting for Irregular Income',
            excerpt: 'Smart strategies for managing money when your income varies from month to month.',
            category: 'Budgeting',
            readTime: 4,
            difficulty: 'intermediate',
            isCompleted: false,
            segment: ['mid-earner', 'high-earner']
        },
        {
            id: '4',
            title: 'Micro-Savings Strategies',
            excerpt: 'How to save money even with a limited budget using small, consistent amounts.',
            category: 'Savings',
            readTime: 3,
            difficulty: 'beginner',
            isCompleted: false,
            segment: ['low-income', 'budget-conscious']
        },
        {
            id: '5',
            title: 'Investment Basics for Students',
            excerpt: 'Introduction to investing concepts and how to start with small amounts.',
            category: 'Investing',
            readTime: 6,
            difficulty: 'advanced',
            isCompleted: false,
            segment: ['high-earner']
        },
        {
            id: '6',
            title: 'Managing Student Loans',
            excerpt: 'Tips for managing student debt and planning for repayment.',
            category: 'Debt',
            readTime: 4,
            difficulty: 'intermediate',
            isCompleted: false,
            segment: ['budget-conscious', 'mid-earner', 'high-earner']
        }
    ];

    const quizzes: Quiz[] = [
        {
            id: '1',
            title: 'Emergency Fund Basics',
            questions: 5,
            difficulty: 'beginner',
            isCompleted: false
        },
        {
            id: '2',
            title: 'Budgeting Fundamentals',
            questions: 8,
            difficulty: 'intermediate',
            isCompleted: false
        },
        {
            id: '3',
            title: 'Investment Knowledge',
            questions: 10,
            difficulty: 'advanced',
            isCompleted: false
        }
    ];

    const challenges: Challenge[] = [
        {
            id: '1',
            title: '7-Day No-Spend Challenge',
            description: 'Avoid unnecessary expenses for 7 days and save money',
            duration: '7 days',
            reward: '₹100 bonus',
            isActive: true,
            progress: 3
        },
        {
            id: '2',
            title: 'Track Every Expense',
            description: 'Log every single expense for 30 days',
            duration: '30 days',
            reward: '₹500 bonus',
            isActive: true,
            progress: 15
        },
        {
            id: '3',
            title: 'Save 10% Challenge',
            description: 'Save 10% of your income for 3 months',
            duration: '3 months',
            reward: '₹1000 bonus',
            isActive: false,
            progress: 0
        }
    ];

    const quizQuestions = [
        {
            question: 'What is an emergency fund?',
            options: [
                'Money kept aside for vacations',
                'Savings kept aside for urgent expenses',
                'Investment in stocks',
                'Money for daily expenses'
            ],
            correct: 1
        },
        {
            question: 'How much should you ideally save in an emergency fund?',
            options: [
                '1 month of expenses',
                '3-6 months of expenses',
                '1 year of expenses',
                'No specific amount'
            ],
            correct: 1
        },
        {
            question: 'Which is NOT a good place to keep emergency funds?',
            options: [
                'Savings account',
                'Fixed deposit',
                'Stock market',
                'Money market account'
            ],
            correct: 2
        }
    ];

    const handleArticleComplete = (articleId: string) => {
        setCompletedArticleIds(prev => {
            const next = new Set(Array.from(prev));
            next.add(articleId);
            return next;
        });
        toast.success('Article completed! +10 points');
    };

    const handleOpenArticle = (article: Article) => {
        setSelectedArticle(article);
        setDraftNote(notesByArticle[article.id] || '');
        setShowArticleReader(true);
    };

    const handleSaveNote = () => {
        if (!selectedArticle) return;
        const articleId = selectedArticle.id;
        setNotesByArticle(prev => ({ ...prev, [articleId]: draftNote }));
        toast.success('Note saved');
    };

    const toggleFavorite = (articleId: string) => {
        setFavoriteArticleIds(prev => {
            const next = new Set(Array.from(prev));
            if (next.has(articleId)) {
                next.delete(articleId);
            } else {
                next.add(articleId);
            }
            return next;
        });
    };

    const handleQuizStart = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setShowQuiz(true);
        setCurrentQuestion(0);
        setQuizScore(0);
    };

    const handleQuizAnswer = (answerIndex: number) => {
        if (selectedQuiz && currentQuestion < quizQuestions.length) {
            if (answerIndex === quizQuestions[currentQuestion].correct) {
                setQuizScore(quizScore + 1);
            }

            if (currentQuestion + 1 < quizQuestions.length) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                // Quiz completed
                const finalScore = answerIndex === quizQuestions[currentQuestion].correct ? quizScore + 1 : quizScore;
                const percentage = (finalScore / quizQuestions.length) * 100;
                toast.success(`Quiz completed! Score: ${Math.round(percentage)}%`);
                if (selectedQuiz) {
                    setQuizResults(prev => ({
                        ...prev,
                        [selectedQuiz.id]: { score: percentage, completed: true }
                    }));
                }
                setShowQuiz(false);
                setSelectedQuiz(null);
            }
        }
    };

    const getSegmentSpecificArticles = () => {
        return articles.filter(article =>
            article.segment.includes(user?.segment || 'budget-conscious')
        );
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-700';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700';
            case 'advanced': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const isArticleCompleted = (articleId: string) => completedArticleIds.has(articleId);
    const isQuizCompleted = (quizId: string) => Boolean(quizResults[quizId]?.completed);

    // Derived stats
    const totalArticlesRead = completedArticleIds.size;
    const totalQuizzesPassed = Object.values(quizResults).filter(r => r.completed && r.score >= 60).length;
    const totalPoints = totalArticlesRead * 10 + totalQuizzesPassed * 20;

    // Persist and hydrate from localStorage
    useEffect(() => {
        try {
            const storedArticles = localStorage.getItem('edu:completedArticles');
            const storedQuizzes = localStorage.getItem('edu:quizResults');
            const storedNotes = localStorage.getItem('edu:notesByArticle');
            const storedFavs = localStorage.getItem('edu:favorites');
            const storedTab = localStorage.getItem('edu:activeTab');
            const storedChallenges = localStorage.getItem('edu:challengeProgress');

            if (storedArticles) setCompletedArticleIds(new Set(JSON.parse(storedArticles)));
            if (storedQuizzes) setQuizResults(JSON.parse(storedQuizzes));
            if (storedNotes) setNotesByArticle(JSON.parse(storedNotes));
            if (storedFavs) setFavoriteArticleIds(new Set(JSON.parse(storedFavs)));
            if (storedTab === 'articles' || storedTab === 'quizzes' || storedTab === 'challenges') setActiveTab(storedTab);
            if (storedChallenges) setChallengeProgressById(JSON.parse(storedChallenges));
        } catch (e) {
            console.warn('Failed to hydrate education data');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('edu:completedArticles', JSON.stringify(Array.from(completedArticleIds)));
        } catch { }
    }, [completedArticleIds]);

    useEffect(() => {
        try {
            localStorage.setItem('edu:quizResults', JSON.stringify(quizResults));
        } catch { }
    }, [quizResults]);

    useEffect(() => {
        try {
            localStorage.setItem('edu:notesByArticle', JSON.stringify(notesByArticle));
        } catch { }
    }, [notesByArticle]);

    useEffect(() => {
        try {
            localStorage.setItem('edu:favorites', JSON.stringify(Array.from(favoriteArticleIds)));
        } catch { }
    }, [favoriteArticleIds]);

    useEffect(() => {
        try {
            localStorage.setItem('edu:activeTab', activeTab);
        } catch { }
    }, [activeTab]);

    useEffect(() => {
        try {
            localStorage.setItem('edu:challengeProgress', JSON.stringify(challengeProgressById));
        } catch { }
    }, [challengeProgressById]);

    const handleAdvanceChallenge = (challengeId: string) => {
        setChallengeProgressById(prev => {
            const current = prev[challengeId] ?? 0;
            const next = Math.min(100, current + 10);
            return { ...prev, [challengeId]: next };
        });
        toast.success('Great job! Challenge progress updated');
    };

    if (showQuiz && selectedQuiz) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                {/* Top Header */}
                <div className="bg-purple-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowLeft className="h-5 w-5 mr-3" onClick={() => setShowQuiz(false)} />
                            <h1 className="text-lg font-bold">{selectedQuiz.title}</h1>
                        </div>
                        <div className="text-sm">
                            Question {currentQuestion + 1} of {quizQuestions.length}
                        </div>
                    </div>
                </div>

                {/* Quiz Content */}
                <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                    <div className="bg-white rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {quizQuestions[currentQuestion].question}
                        </h2>

                        <div className="space-y-3">
                            {quizQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuizAnswer(index)}
                                    className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-800">{option}</span>
                                </button>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{currentQuestion + 1} / {quizQuestions.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Article reader modal-like screen
    if (showArticleReader && selectedArticle) {
        const isFav = favoriteArticleIds.has(selectedArticle.id);
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                <div className="bg-purple-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowLeft className="h-5 w-5 mr-3" onClick={() => setShowArticleReader(false)} />
                            <h1 className="text-lg font-bold">{selectedArticle.title}</h1>
                        </div>
                        <button
                            onClick={() => toggleFavorite(selectedArticle.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${isFav ? 'bg-yellow-400 text-white' : 'bg-white text-purple-700'}`}
                        >
                            <span className="flex items-center">
                                <Star className={`h-4 w-4 mr-1 ${isFav ? 'text-white' : 'text-yellow-500'}`} />
                                {isFav ? 'Favorited' : 'Favorite'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                    <div className="bg-white rounded-2xl p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
                            <p className="text-sm text-gray-700">{selectedArticle.excerpt}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Notes</h3>
                            <textarea
                                value={draftNote}
                                onChange={(e) => setDraftNote(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                                rows={5}
                                placeholder="Write your notes here..."
                            />
                            <div className="flex items-center justify-between mt-3">
                                <button
                                    onClick={handleSaveNote}
                                    className="bg-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-purple-700"
                                >
                                    Save Note
                                </button>
                                <button
                                    onClick={() => { handleArticleComplete(selectedArticle.id); setShowArticleReader(false); }}
                                    className="bg-green-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-700"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Top Header */}
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-3" onClick={() => navigate(-1)} />
                        <h1 className="text-lg font-bold">Financial Education</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                {/* Stats Overview */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-600">Articles Read</p>
                            <p className="text-lg font-bold text-purple-600">{totalArticlesRead}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Trophy className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">Quizzes Passed</p>
                            <p className="text-lg font-bold text-green-600">{totalQuizzesPassed}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Star className="h-6 w-6 text-yellow-600" />
                            </div>
                            <p className="text-sm text-gray-600">Points Earned</p>
                            <p className="text-lg font-bold text-yellow-600">{totalPoints}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'articles'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Articles
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'quizzes'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Quizzes
                    </button>
                    <button
                        onClick={() => setActiveTab('challenges')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'challenges'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Challenges
                    </button>
                </div>

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
                        {getSegmentSpecificArticles().map((article) => (
                            <div key={article.id} className="bg-white rounded-2xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 mb-2">{article.title}</h4>
                                        <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                {article.category}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                                {article.difficulty}
                                            </span>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {article.readTime} min
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => toggleFavorite(article.id)} className="text-yellow-500">
                                            <Star className={`h-5 w-5 ${favoriteArticleIds.has(article.id) ? 'fill-yellow-400' : ''}`} />
                                        </button>
                                        {isArticleCompleted(article.id) && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleOpenArticle(article)}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                                >
                                    {isArticleCompleted(article.id) ? 'Re-read Article' : 'Read Article'}
                                </button>
                                {notesByArticle[article.id] && (
                                    <div className="mt-3 p-3 bg-purple-50 rounded-xl">
                                        <p className="text-xs text-gray-600">Saved note:</p>
                                        <p className="text-sm text-gray-800 line-clamp-2">{notesByArticle[article.id]}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Your Knowledge</h3>
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-white rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                                        <p className="text-sm text-gray-600">{quiz.questions} questions</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                                            {quiz.difficulty}
                                        </span>
                                        {isQuizCompleted(quiz.id) && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleQuizStart(quiz)}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    {isQuizCompleted(quiz.id) ? 'Retake Quiz' : 'Start Quiz'}
                                </button>
                                {quizResults[quiz.id] && (
                                    <p className="text-xs text-gray-600 mt-2">Last score: {Math.round(quizResults[quiz.id].score)}%</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Challenges Tab */}
                {activeTab === 'challenges' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Challenges</h3>
                        {challenges.map((challenge) => {
                            const progress = challengeProgressById[challenge.id] ?? challenge.progress;
                            const isActive = challenge.isActive;
                            return (
                                <div key={challenge.id} className="bg-white rounded-2xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-2">{challenge.title}</h4>
                                            <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                        {challenge.duration}
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                        {challenge.reward}
                                                    </span>
                                                </div>
                                                {isActive && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => isActive ? handleAdvanceChallenge(challenge.id) : undefined}
                                        className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${isActive
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                        disabled={!isActive}
                                    >
                                        {isActive ? 'Continue Challenge' : 'Coming Soon'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationPage;
