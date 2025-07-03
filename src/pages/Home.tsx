import { Link } from "react-router-dom";
import { Calendar, TrendingUp, Eye, Brain, Clock } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <header className="text-center pt-8 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-aqua-primary animate-glow-pulse" />
          <h1 className="text-4xl font-bold text-gradient">TimeTutor</h1>
          <Clock className="w-8 h-8 text-aqua-secondary animate-float" />
        </div>
        <p className="text-lg text-muted-foreground">Smart Time Manager</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {/* Welcome Message */}
        <div className="card-dark text-center mb-8 max-w-2xl animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 glow-text">
            Vanakkam da! TimeTutor kooda Smart ah plan pannalaam 🧠⏰
          </h2>
          <p className="text-xl text-muted-foreground mb-2">
            Time Management + Planning + Daily Progress = Success da!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
          <Link 
            to="/plan" 
            className="card-dark text-center group hover:scale-105 transition-transform duration-300"
          >
            <Calendar className="w-12 h-12 text-aqua-primary mx-auto mb-4 group-hover:animate-float" />
            <h3 className="text-xl font-semibold mb-2 text-gradient">Plan My Day</h3>
            <p className="text-muted-foreground text-sm">📝 Create your daily schedule</p>
          </Link>

          <Link 
            to="/track" 
            className="card-dark text-center group hover:scale-105 transition-transform duration-300"
          >
            <TrendingUp className="w-12 h-12 text-aqua-secondary mx-auto mb-4 group-hover:animate-float" />
            <h3 className="text-xl font-semibold mb-2 text-gradient">Track Progress</h3>
            <p className="text-muted-foreground text-sm">📊 Mark tasks as complete</p>
          </Link>

          <Link 
            to="/view" 
            className="card-dark text-center group hover:scale-105 transition-transform duration-300"
          >
            <Eye className="w-12 h-12 text-aqua-primary mx-auto mb-4 group-hover:animate-float" />
            <h3 className="text-xl font-semibold mb-2 text-gradient">View My Plan</h3>
            <p className="text-muted-foreground text-sm">📅 See your schedule overview</p>
          </Link>
        </div>

        {/* Motivational Quote */}
        <div className="card-dark text-center max-w-2xl">
          <blockquote className="text-lg italic text-aqua-primary mb-2">
            "Naalai success venumna, indru smart ah plan pannanum da!"
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Tomorrow's success starts with today's smart planning!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-8">
        <div className="card-dark inline-block">
          <p className="text-aqua-secondary font-medium">
            Time management la king aagalam da – with smart steps! 🔥
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            🧠 TimeTutor – Plan Smart. Win Smart. By Mohan
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;