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
    Clock,
    ChevronRight,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Interfaces mapping from original
interface Article {
    id: string; title: string; excerpt: string; category: string; readTime: number; difficulty: 'beginner' | 'intermediate' | 'advanced'; isCompleted: boolean; segment: string[];
}
interface Quiz { id: string; title: string; questions: number; difficulty: 'beginner' | 'intermediate' | 'advanced'; isCompleted: boolean; score?: number; }
interface Challenge { id: string; title: string; description: string; duration: string; reward: string; isActive: boolean; progress: number; }

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

    // Hardcoded Dummy Data
    const articles: Article[] = [
        { id: '1', title: 'What is an Emergency Fund?', excerpt: 'Learn why having an emergency fund is crucial for financial security and how to build one.', category: 'Savings', readTime: 3, difficulty: 'beginner', isCompleted: false, segment: ['low-income', 'budget-conscious', 'mid-earner', 'high-earner'] },
        { id: '2', title: 'Understanding Compound Interest', excerpt: 'Discover how compound interest can work for you and help grow your savings over time.', category: 'Investing', readTime: 5, difficulty: 'intermediate', isCompleted: false, segment: ['mid-earner', 'high-earner'] },
        { id: '3', title: 'Budgeting for Irregular Income', excerpt: 'Smart strategies for managing money when your income varies from month to month.', category: 'Budgeting', readTime: 4, difficulty: 'intermediate', isCompleted: false, segment: ['mid-earner', 'high-earner'] },
        { id: '4', title: 'Micro-Savings Strategies', excerpt: 'How to save money even with a limited budget using small, consistent amounts.', category: 'Savings', readTime: 3, difficulty: 'beginner', isCompleted: false, segment: ['low-income', 'budget-conscious'] },
        { id: '5', title: 'Investment Basics for Students', excerpt: 'Introduction to investing concepts and how to start with small amounts.', category: 'Investing', readTime: 6, difficulty: 'advanced', isCompleted: false, segment: ['high-earner'] },
        { id: '6', title: 'Managing Student Loans', excerpt: 'Tips for managing student debt and planning for repayment.', category: 'Debt', readTime: 4, difficulty: 'intermediate', isCompleted: false, segment: ['budget-conscious', 'mid-earner', 'high-earner'] }
    ];

    const quizzes: Quiz[] = [
        { id: '1', title: 'Emergency Fund Basics', questions: 5, difficulty: 'beginner', isCompleted: false },
        { id: '2', title: 'Budgeting Fundamentals', questions: 8, difficulty: 'intermediate', isCompleted: false },
        { id: '3', title: 'Investment Knowledge', questions: 10, difficulty: 'advanced', isCompleted: false }
    ];

    const challenges: Challenge[] = [
        { id: '1', title: '7-Day No-Spend Challenge', description: 'Avoid unnecessary expenses for 7 days and save money', duration: '7 days', reward: '₹100 bonus', isActive: true, progress: 30 },
        { id: '2', title: 'Track Every Expense', description: 'Log every single expense for 30 days', duration: '30 days', reward: '₹500 bonus', isActive: true, progress: 15 },
        { id: '3', title: 'Save 10% Challenge', description: 'Save 10% of your income for 3 months', duration: '3 months', reward: '₹1000 bonus', isActive: false, progress: 0 }
    ];

    const quizQuestions = [
        { question: 'What is an emergency fund?', options: ['Money kept aside for vacations', 'Savings kept aside for urgent expenses', 'Investment in stocks', 'Money for daily expenses'], correct: 1 },
        { question: 'How much should you ideally save in an emergency fund?', options: ['1 month of expenses', '3-6 months of expenses', '1 year of expenses', 'No specific amount'], correct: 1 },
        { question: 'Which is NOT a good place to keep emergency funds?', options: ['Savings account', 'Fixed deposit', 'Stock market', 'Money market account'], correct: 2 }
    ];

    // Functions
    const handleArticleComplete = (articleId: string) => {
        setCompletedArticleIds(prev => { const next = new Set(Array.from(prev)); next.add(articleId); return next; });
        toast.success('Article completed! +10 points', { icon: '⭐️' });
    };

    const handleOpenArticle = (article: Article) => {
        setSelectedArticle(article);
        setDraftNote(notesByArticle[article.id] || '');
        setShowArticleReader(true);
    };

    const handleSaveNote = () => {
        if (!selectedArticle) return;
        setNotesByArticle(prev => ({ ...prev, [selectedArticle.id]: draftNote }));
        toast.success('Note saved successfully');
    };

    const toggleFavorite = (articleId: string) => {
        setFavoriteArticleIds(prev => {
            const next = new Set(Array.from(prev));
            if (next.has(articleId)) next.delete(articleId); else next.add(articleId);
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
            if (answerIndex === quizQuestions[currentQuestion].correct) setQuizScore(quizScore + 1);
            if (currentQuestion + 1 < quizQuestions.length) setCurrentQuestion(currentQuestion + 1);
            else {
                const finalScore = answerIndex === quizQuestions[currentQuestion].correct ? quizScore + 1 : quizScore;
                const percentage = (finalScore / quizQuestions.length) * 100;
                toast.success(`Quiz completed! Score: ${Math.round(percentage)}%`, { icon: percentage >= 60 ? '🎉' : '📚' });
                if (selectedQuiz) setQuizResults(prev => ({ ...prev, [selectedQuiz.id]: { score: percentage, completed: true } }));
                setShowQuiz(false);
                setSelectedQuiz(null);
            }
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSegmentSpecificArticles = () => articles.filter(article => article.segment.includes(user?.segment || 'budget-conscious'));
    const isArticleCompleted = (articleId: string) => completedArticleIds.has(articleId);
    const isQuizCompleted = (quizId: string) => Boolean(quizResults[quizId]?.completed);

    const totalArticlesRead = completedArticleIds.size;
    const totalQuizzesPassed = Object.values(quizResults).filter(r => r.completed && r.score >= 60).length;
    const totalPoints = totalArticlesRead * 10 + totalQuizzesPassed * 20;

    // Load state
    useEffect(() => {
        try {
            const storedArticles = localStorage.getItem('edu:completedArticles');
            const storedQuizzes = localStorage.getItem('edu:quizResults');
            const storedNotes = localStorage.getItem('edu:notesByArticle');
            const storedFavs = localStorage.getItem('edu:favorites');
            if (storedArticles) setCompletedArticleIds(new Set(JSON.parse(storedArticles)));
            if (storedQuizzes) setQuizResults(JSON.parse(storedQuizzes));
            if (storedNotes) setNotesByArticle(JSON.parse(storedNotes));
            if (storedFavs) setFavoriteArticleIds(new Set(JSON.parse(storedFavs)));
        } catch (e) {}
    }, []);

    // Animation Variants
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    // --- QUIZ VIEW ---
    if (showQuiz && selectedQuiz) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto pt-4 pb-20">
                <div className="flex items-center justify-between mb-8 px-2">
                    <button onClick={() => setShowQuiz(false)} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h1>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{currentQuestion + 1} / {quizQuestions.length}</span>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{quizQuestions[currentQuestion].question}</h2>
                    <div className="space-y-4">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuizAnswer(index)}
                                className="w-full p-5 text-left bg-gray-50 border border-gray-100 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md hover:-translate-y-1 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-4 group-hover:border-indigo-300 group-hover:bg-indigo-100 transition-colors">
                                        <span className="text-sm font-bold text-gray-500 group-hover:text-indigo-600">{String.fromCharCode(65 + index)}</span>
                                    </div>
                                    <span className="font-bold text-gray-700 group-hover:text-gray-900">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- ARTICLE READER VIEW ---
    if (showArticleReader && selectedArticle) {
        const isFav = favoriteArticleIds.has(selectedArticle.id);
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pt-4 pb-20">
                <div className="flex items-center justify-between mb-8 px-2">
                    <button onClick={() => setShowArticleReader(false)} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex space-x-2">
                        <button onClick={() => toggleFavorite(selectedArticle.id)} className={`p-2 rounded-full border transition-all flex items-center justify-center ${isFav ? 'bg-yellow-50 border-yellow-200 text-yellow-500' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                            <Star className={`w-5 h-5 ${isFav ? 'fill-yellow-500' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                            {selectedArticle.category}
                        </span>
                        <div className="flex items-center text-xs font-bold text-gray-500">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {selectedArticle.readTime} MIN READ
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">{selectedArticle.title}</h1>
                    
                    <div className="prose prose-indigo prose-lg text-gray-600 mb-12">
                        <p className="text-xl font-medium text-gray-800 leading-relaxed mb-8">{selectedArticle.excerpt}</p>
                        <p>This is placeholder content. In a production app, the full article text would be fetched from the database or CMS. The layout emphasizes clean typography, ample whitespace, and lack of distractions.</p>
                        <p>Having an emergency fund acts as a financial buffer that can keep you afloat in a time of need without having to rely on credit cards or high-interest loans.</p>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                            Your Notes
                        </h3>
                        <textarea
                            value={draftNote}
                            onChange={(e) => setDraftNote(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none h-32"
                            placeholder="Jot down key takeaways here..."
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                            <button onClick={handleSaveNote} className="w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                Save Note
                            </button>
                            <button 
                                onClick={() => { handleArticleComplete(selectedArticle.id); setShowArticleReader(false); }}
                                className={`w-full sm:w-auto py-3 px-6 rounded-xl font-bold flex items-center justify-center transition-all ${isArticleCompleted(selectedArticle.id) ? 'bg-green-50 text-green-700 border border-green-200 pointer-events-none' : 'bg-gray-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'}`}
                            >
                                {isArticleCompleted(selectedArticle.id) ? (
                                    <><CheckCircle className="w-5 h-5 mr-2" /> Completed</>
                                ) : (
                                    'Mark as Completed'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- MAIN DASHBOARD VIEW ---
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto pb-24 lg:pb-8">
            
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">FinEd Hub</h1>
                <p className="text-gray-500 font-medium mt-1 text-lg">Master your money, one step at a time.</p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex items-center">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 shadow-inner border border-blue-100/50">
                        <BookOpen className="h-7 w-7 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Articles Read</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{totalArticlesRead}</p>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex items-center">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mr-4 shadow-inner border border-green-100/50">
                        <Trophy className="h-7 w-7 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Quizzes Passed</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">{totalQuizzesPassed}</p>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex items-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 blur-md">
                        <Star className="w-32 h-32 fill-yellow-500" />
                    </div>
                    <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mr-4 shadow-inner border border-yellow-100/50 relative z-10">
                        <Star className="h-7 w-7 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Points</p>
                        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">{totalPoints}</p>
                    </div>
                </div>
            </motion.div>

            {/* Custom Tabs */}
            <motion.div variants={itemVariants} className="flex overflow-x-auto hide-scrollbar space-x-2 mb-8 bg-white/70 backdrop-blur-xl p-2 rounded-full border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-max">
                {(['articles', 'quizzes', 'challenges'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-colors z-10 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {activeTab === tab && (
                            <motion.div layoutId="edutab" className="absolute inset-0 bg-gray-900 rounded-full -z-10 shadow-md" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                        )}
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Content Area */}
            <div className="w-full">
                <AnimatePresence mode="wait">
                    
                    {/* ARTICLES */}
                    {activeTab === 'articles' && (
                        <motion.div key="articles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {getSegmentSpecificArticles().map((article) => (
                                <div key={article.id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col h-full group hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getDifficultyColor(article.difficulty)}`}>
                                            {article.difficulty}
                                        </span>
                                        <div className="flex space-x-2">
                                            {isArticleCompleted(article.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                                            <button onClick={() => toggleFavorite(article.id)}>
                                                <Star className={`w-5 h-5 ${favoriteArticleIds.has(article.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                                    <p className="text-gray-500 font-medium text-sm line-clamp-2 mb-6 flex-grow">{article.excerpt}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs font-bold text-gray-400 flex items-center"><Clock className="w-4 h-4 mr-1"/> {article.readTime} min</span>
                                        <button onClick={() => handleOpenArticle(article)} className="p-3 bg-gray-50 text-gray-700 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* QUIZZES */}
                    {activeTab === 'quizzes' && (
                        <motion.div key="quizzes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col relative overflow-hidden group">
                                    
                                    <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                                        <Award className="w-40 h-40" />
                                    </div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                                            <Play className="w-5 h-5 text-indigo-500 ml-1" />
                                        </div>
                                        {isQuizCompleted(quiz.id) && (
                                            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <span className="text-xs font-bold text-green-700">{Math.round(quizResults[quiz.id].score)}%</span>
                                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight relative z-10">{quiz.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 relative z-10 mb-6">{quiz.questions} Questions • {quiz.difficulty}</p>
                                    
                                    <button onClick={() => handleQuizStart(quiz)} className="mt-auto w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all relative z-10">
                                        {isQuizCompleted(quiz.id) ? 'Retake Quiz' : 'Start Quiz'}
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* CHALLENGES */}
                    {activeTab === 'challenges' && (
                        <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {challenges.map((challenge) => (
                                <div key={challenge.id} className={`bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 transition-all ${!challenge.isActive ? 'opacity-70 grayscale-[50%]' : 'hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)]'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${challenge.isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                            {challenge.duration}
                                        </span>
                                        <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 flex items-center">
                                            <Trophy className="w-3.5 h-3.5 mr-1" /> {challenge.reward}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{challenge.title}</h3>
                                    <p className="text-gray-500 font-medium text-sm mb-6">{challenge.description}</p>
                                    
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                            <span>Progress</span>
                                            <span className={challenge.isActive ? 'text-indigo-600' : ''}>{challenge.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className={`h-2 rounded-full transition-all duration-1000 ease-out ${challenge.isActive ? 'bg-indigo-500' : 'bg-gray-300'}`} style={{ width: `${challenge.progress}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <button disabled={!challenge.isActive} className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center ${challenge.isActive ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                        {challenge.isActive ? 'Continue Challenge' : 'Coming Soon'}
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default EducationPage;
