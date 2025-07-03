import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Plan {
  id: number;
  task: string;
  timeRange: string;
  importance: string;
  status: string;
  date: string;
}

const ViewPlan = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadPlans = () => {
      const storedPlans = JSON.parse(localStorage.getItem("timeTutorPlans") || "[]");
      const todayPlans = storedPlans.filter((plan: Plan) => plan.date === today);
      setPlans(todayPlans);
    };

    loadPlans();
  }, [today]);

  const getProgressStats = () => {
    const total = plans.length;
    const completed = plans.filter(plan => plan.status === "Completed").length;
    const skipped = plans.filter(plan => plan.status === "Skipped").length;
    const pending = plans.filter(plan => plan.status === "Incomplete").length;
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, skipped, pending, progressPercentage };
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "High": return "text-red-400 border-red-400/30 bg-red-400/10";
      case "Medium": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "Low": return "text-green-400 border-green-400/30 bg-green-400/10";
      default: return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "Skipped": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-aqua-primary" />;
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Naalai success venumna, indru smart ah plan pannanum da!",
      "Smart planning + consistent action = super result!",
      "Every small step counts towards your big dreams da!",
      "Time management mastery = Life mastery!",
      "Discipline today, victory tomorrow da!"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon" className="text-aqua-primary border-aqua-primary hover:bg-aqua-primary hover:text-black">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient">View My Plan</h1>
        </div>
        <p className="text-aqua-secondary text-lg text-center">
          Your daily overview da! See how you're progressing 📅
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        {plans.length === 0 ? (
          <div className="card-dark text-center py-12">
            <Calendar className="w-16 h-16 text-aqua-primary mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold mb-2 text-aqua-primary">No plans for today!</h3>
            <p className="text-muted-foreground mb-6">
              Time to create your daily schedule. Let's get organized da!
            </p>
            <Link to="/plan">
              <Button className="btn-aqua">
                Plan Your Day
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-dark text-center">
                <Target className="w-8 h-8 text-aqua-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
              <div className="card-dark text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-green-400">{stats.completed}</h3>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="card-dark text-center">
                <Clock className="w-8 h-8 text-aqua-secondary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-aqua-secondary">{stats.pending}</h3>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="card-dark text-center">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-red-400">{stats.skipped}</h3>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="card-dark">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-aqua-primary" />
                <h2 className="text-xl font-semibold text-aqua-primary">Daily Progress</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-aqua-primary font-medium">{stats.progressPercentage}%</span>
                </div>
                <Progress 
                  value={stats.progressPercentage} 
                  className="h-3 bg-[hsl(var(--dark-surface))]"
                />
                <p className="text-xs text-muted-foreground">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </div>
            </div>

            {/* Tasks List */}
            <div className="card-dark">
              <h2 className="text-xl font-semibold text-aqua-primary mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </h2>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="bg-[hsl(var(--dark-surface))] rounded-xl p-4 border border-border hover:border-aqua-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(plan.status)}
                          <h3 className={`font-semibold ${
                            plan.status === "Completed" ? "text-green-400 line-through" :
                            plan.status === "Skipped" ? "text-red-400 line-through" :
                            "text-foreground"
                          }`}>
                            {plan.task}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{plan.timeRange}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getImportanceColor(plan.importance)}`}>
                            {plan.importance}
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
                        plan.status === "Completed" ? "bg-green-400/20 text-green-400" :
                        plan.status === "Skipped" ? "bg-red-400/20 text-red-400" :
                        "bg-aqua-primary/20 text-aqua-primary"
                      }`}>
                        {plan.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="card-dark text-center bg-gradient-to-r from-aqua-primary/10 to-aqua-secondary/10 border-aqua-primary/30">
              <h3 className="text-lg font-semibold text-aqua-primary mb-3">
                Daily Motivation 🔥
              </h3>
              <blockquote className="text-lg italic text-aqua-secondary mb-2">
                "{getMotivationalQuote()}"
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Keep pushing forward da! Success is built one task at a time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/plan">
                <Button className="btn-aqua w-full py-4">
                  Add More Tasks
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" className="w-full py-4 border-aqua-primary text-aqua-primary hover:bg-aqua-primary hover:text-black">
                  Update Progress
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-8">
        <p className="text-xs text-muted-foreground">
          🧠 TimeTutor – Plan Smart. Win Smart. By Mohan
        </p>
      </footer>
    </div>
  );
};

export default ViewPlan;