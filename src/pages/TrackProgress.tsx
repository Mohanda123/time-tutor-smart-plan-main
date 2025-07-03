import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: number;
  task: string;
  timeRange: string;
  importance: string;
  status: string;
  date: string;
}

const TrackProgress = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadPlans = () => {
      const storedPlans = JSON.parse(localStorage.getItem("timeTutorPlans") || "[]");
      const todayPlans = storedPlans.filter((plan: Plan) => plan.date === today);
      setPlans(todayPlans);
    };

    loadPlans();
  }, [today]);

  const updateTaskStatus = (id: number, newStatus: string) => {
    const storedPlans = JSON.parse(localStorage.getItem("timeTutorPlans") || "[]");
    const updatedPlans = storedPlans.map((plan: Plan) => 
      plan.id === id ? { ...plan, status: newStatus } : plan
    );
    
    localStorage.setItem("timeTutorPlans", JSON.stringify(updatedPlans));
    
    const todayPlans = updatedPlans.filter((plan: Plan) => plan.date === today);
    setPlans(todayPlans);

    if (newStatus === "Completed") {
      toast({
        title: "Semma da! One step closer to victory! 💪",
        description: "Task completed successfully. Keep the momentum going!",
      });
    } else if (newStatus === "Skipped") {
      toast({
        title: "No problem da! Focus on the next one! 🎯",
        description: "Learn from this and tackle the remaining tasks.",
        variant: "destructive"
      });
    }
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
          <h1 className="text-3xl font-bold text-gradient">Track My Progress</h1>
        </div>
        <p className="text-aqua-secondary text-lg text-center">
          Update your task status da! Mark what you've accomplished 📊
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {plans.length === 0 ? (
          <div className="card-dark text-center py-12">
            <Trophy className="w-16 h-16 text-aqua-primary mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold mb-2 text-aqua-primary">No tasks for today!</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't planned anything yet. Let's get started!
            </p>
            <Link to="/plan">
              <Button className="btn-aqua">
                Create Your First Plan
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="card-dark">
              <h2 className="text-xl font-semibold text-aqua-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Tasks ({plans.length})
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Click the buttons to update your progress. Stay honest with yourself da!
              </p>
            </div>

            <div className="grid gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="card-dark">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(plan.status)}
                        <h3 className="text-lg font-semibold text-foreground">
                          {plan.task}
                        </h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getImportanceColor(plan.importance)}`}>
                          {plan.importance}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{plan.timeRange}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`text-sm font-medium ${
                          plan.status === "Completed" ? "text-green-400" :
                          plan.status === "Skipped" ? "text-red-400" :
                          "text-aqua-primary"
                        }`}>
                          Status: {plan.status}
                        </span>
                      </div>
                    </div>

                    {plan.status === "Incomplete" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateTaskStatus(plan.id, "Completed")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Done
                        </Button>
                        <Button
                          onClick={() => updateTaskStatus(plan.id, "Skipped")}
                          variant="outline"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-4 py-2 rounded-xl transition-all duration-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Skip
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Message */}
            <div className="card-dark text-center bg-gradient-to-r from-aqua-primary/10 to-aqua-secondary/10 border-aqua-primary/30">
              <h3 className="text-lg font-semibold text-aqua-primary mb-2">
                Keep Going Da! 🔥
              </h3>
              <p className="text-muted-foreground">
                Every completed task is a step closer to your goals. Progress over perfection!
              </p>
              <blockquote className="text-aqua-secondary italic mt-4">
                "Consistent small steps lead to big victories da!"
              </blockquote>
            </div>
          </div>
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

export default TrackProgress;