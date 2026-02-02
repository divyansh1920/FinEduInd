import React, { useState } from 'react';
import { Module } from '../types';
import { MODULES, GENERAL_QUIZ } from '../constants';
import { Clock, Book, ArrowRight, CheckCircle, ChevronRight, Check, X, Zap, Lightbulb, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ModuleViewProps {
  onBack: () => void;
}

const ModuleView: React.FC<ModuleViewProps> = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Helper to dynamically render Lucide icon
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : <Book className="h-6 w-6" />;
  };

  // Helper to parse bold text markdown (**text**)
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-slate-900 font-bold bg-yellow-50/50 px-1 rounded">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleAnswerSelect = (qId: number, optionIndex: number) => {
    if (showQuizResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    GENERAL_QUIZ.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  if (activeModule) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <button onClick={() => setActiveModule(null)} className="group mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <div className="bg-white border border-slate-200 p-2 rounded-lg mr-2 group-hover:border-indigo-300 shadow-sm">
             <Icons.ArrowLeft className="h-4 w-4" /> 
          </div>
          Back to Knowledge Hub
        </button>
        
        {/* Module Header */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
          <div className="bg-slate-900 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-40 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600 rounded-full blur-[80px] opacity-30 -ml-10 -mb-10"></div>
            
            <div className="relative z-10 text-white">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm border border-white/10`}>
                      {activeModule.difficulty} Level
                  </span>
                  <span className="flex items-center text-indigo-200 text-sm font-medium bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/5">
                      <Clock className="h-3.5 w-3.5 mr-2" /> {activeModule.duration} Read
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-[Poppins] mb-6 leading-tight">{activeModule.title}</h1>
                <p className="text-xl text-slate-300 max-w-3xl font-light leading-relaxed">{activeModule.description}</p>
            </div>
          </div>

          {/* Module Content */}
          <div className="p-8 md:p-14 space-y-16">
            {activeModule.content.map((section, idx) => (
              <div key={idx} className="relative group">
                {/* Connector Line */}
                {idx !== activeModule.content.length - 1 && (
                    <div className="absolute left-[19px] top-12 bottom-[-4rem] w-0.5 bg-slate-100 group-hover:bg-indigo-50 transition-colors"></div>
                )}

                <div className="flex items-start gap-6 md:gap-8">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-bold text-lg border-2 border-indigo-100 shadow-sm group-hover:border-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 relative z-10">
                        {idx + 1}
                    </div>
                    
                    <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 font-[Poppins] group-hover:text-indigo-700 transition-colors">{section.title}</h3>
                        
                        {/* Main Body Text with formatting */}
                        <div className="text-slate-600 leading-8 text-lg mb-8">
                            {section.body.split('\n').map((line, i) => {
                                if (line.startsWith('•')) {
                                    return (
                                      <div key={i} className="flex gap-3 mb-3 ml-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></div>
                                        <span className="text-slate-700">{formatText(line.substring(1))}</span>
                                      </div>
                                    );
                                }
                                if (line.trim() === '') return <br key={i} className="block content-[''] h-4"/>;
                                return <p key={i} className="mb-2 text-justify">{formatText(line)}</p>
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Example Box */}
                            {section.example && (
                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden transition-colors hover:bg-emerald-50">
                                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" /> Real World Scenario
                                </p>
                                <p className="text-slate-800 font-medium italic relative z-10 leading-relaxed">"{formatText(section.example)}"</p>
                            </div>
                            )}

                            {/* Pro Tip Box */}
                            {section.proTip && (
                                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden transition-colors hover:bg-indigo-50">
                                    <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" /> Expert Pro Tip
                                    </p>
                                    <p className="text-slate-800 font-medium relative z-10 leading-relaxed">{formatText(section.proTip)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-center pb-12">
             <button 
                onClick={() => { setActiveModule(null); setQuizMode(true); }}
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-indigo-600 focus:outline-none shadow-xl shadow-slate-200 hover:shadow-indigo-200 hover:-translate-y-1"
              >
                Take the Quiz
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Mode Logic
  if (quizMode) {
    const score = calculateScore();
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <button onClick={() => setQuizMode(false)} className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
          <Icons.ArrowLeft className="h-4 w-4 mr-1" /> Quit Quiz
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 font-[Poppins]">Knowledge Check</h2>
            <p className="text-slate-500 mt-2 text-lg">Test your understanding of the financial concepts.</p>
          </div>

          <div className="space-y-10">
            {GENERAL_QUIZ.map((q, qIndex) => (
              <div key={q.id} className="border-b border-slate-100 pb-10 last:border-0 last:pb-0">
                <p className="font-semibold text-xl text-slate-800 mb-6 flex gap-3">
                    <span className="text-indigo-600 font-bold">{qIndex + 1}.</span> 
                    {q.question}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[q.id] === oIndex;
                    const isCorrect = q.correctAnswer === oIndex;
                    
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ";
                    
                    if (showQuizResults) {
                      if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-700 shadow-sm";
                      else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-300 text-red-700 shadow-sm";
                      else btnClass += "bg-white border-slate-100 text-slate-400 opacity-60";
                    } else {
                      btnClass += isSelected 
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500" 
                        : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600";
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(q.id, oIndex)}
                        className={btnClass}
                        disabled={showQuizResults}
                      >
                        <span className="font-medium">{option}</span>
                        {showQuizResults && isCorrect && <Check className="h-5 w-5 text-green-600" />}
                        {showQuizResults && isSelected && !isCorrect && <X className="h-5 w-5 text-red-500" />}
                        {!showQuizResults && !isSelected && <div className="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-indigo-400"></div>}
                        {!showQuizResults && isSelected && <div className="h-4 w-4 rounded-full border-[5px] border-indigo-600 bg-white"></div>}
                      </button>
                    );
                  })}
                </div>
                {showQuizResults && (
                   <div className="mt-4 p-5 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-100 flex gap-3 items-start">
                     <div className="bg-blue-200 rounded-full p-1 mt-0.5"><Icons.Info className="h-3 w-3 text-blue-700"/></div>
                     <div><span className="font-bold block mb-1">Explanation:</span>{q.explanation}</div>
                   </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100 flex justify-center">
            {!showQuizResults ? (
              <button 
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(selectedAnswers).length < GENERAL_QUIZ.length}
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
              >
                Submit Answers
              </button>
            ) : (
              <div className="text-center animate-fade-in w-full bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <p className="text-4xl font-bold mb-2 font-[Poppins] text-indigo-600">{score} / {GENERAL_QUIZ.length}</p>
                <p className="text-slate-600 mb-6 font-medium text-lg">
                  {score === GENERAL_QUIZ.length ? "Outstanding! You are ready for the market!" : "Good start! Review the topics and try again."}
                </p>
                <button 
                  onClick={() => { setQuizMode(false); setSelectedAnswers({}); setShowQuizResults(false); }}
                  className="bg-white text-slate-900 border border-slate-300 px-8 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Back to Modules
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">Structured Learning Path</span>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl font-[Poppins] mb-4">
          Financial Knowledge Hub
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Deep-dive modules designed for the Indian Investor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {MODULES.map((module, index) => (
          <div 
            key={module.id}
            onClick={() => setActiveModule(module)}
            className="group relative bg-white rounded-3xl shadow-lg shadow-slate-100 border border-slate-100 p-8 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden"
          >
            {/* Decorative background element */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110 
                ${index % 2 === 0 ? 'from-blue-500 to-cyan-500' : 'from-indigo-500 to-purple-500'}`}></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:rotate-6
                 ${index % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-cyan-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200'}`}>
                {renderIcon(module.icon)}
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                  module.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {module.difficulty}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-[Poppins] mb-3">
              {module.title}
            </h3>
            <p className="text-slate-500 line-clamp-2 mb-6 text-sm leading-relaxed">
              {module.description}
            </p>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5" /> {module.duration}
              </span>
              <span className="text-indigo-600 font-bold text-sm flex items-center group-hover:underline decoration-2 underline-offset-4">
                Start Learning <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleView;