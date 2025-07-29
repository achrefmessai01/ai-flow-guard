import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, DollarSign, Clock, Users, Zap, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import heroImage from "@/assets/dashboard-hero.jpg";
import { useLiteLLMLogs, useSecurityAlerts, usePerformanceMetrics } from "@/hooks/useLiteLLMLogs";

const Dashboard = () => {
  const { data: logs, isLoading: logsLoading } = useLiteLLMLogs(50);
  const { data: securityAlerts, isLoading: alertsLoading } = useSecurityAlerts();
  const { data: performanceMetrics, isLoading: metricsLoading } = usePerformanceMetrics();

  const recentPrompts = logs?.slice(0, 10).map(log => ({
    id: log.id,
    prompt: log.prompt || "N/A",
    model: log.model || "N/A",
    spend: log.spend || 0,
    latency: log.latency_sec ? `${log.latency_sec}s` : "N/A",
    status: log.status || "unknown",
    severity: (log.security_analysis as any)?.severity || "LOW",
    timestamp: log.created_at || new Date().toISOString()
  })) || [];

  const alerts = securityAlerts?.map(alert => ({
    id: alert.id,
    severity: (alert.security_analysis as any)?.severity || "UNKNOWN",
    title: (alert.security_analysis as any)?.summary || "Security Alert",
    prompt: alert.prompt || "N/A",
    timestamp: alert.created_at || new Date().toISOString(),
    user: alert.user_id || "unknown",
    status: "active"
  })) || [];

  if (logsLoading || alertsLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-subtle border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        <img 
          src={heroImage} 
          alt="DevSecOps Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">AI DevSecOps Control Center</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real-time monitoring and security analysis for LLM operations powered by n8n and LiteLLM
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card shadow-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics?.totalRequests.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Total API calls processed</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${performanceMetrics?.totalSpend || "0.00"}</div>
              <p className="text-xs text-muted-foreground">Avg. latency: {performanceMetrics?.avgLatency || "0s"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Zap className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics?.successRate || "0%"}</div>
              <p className="text-xs text-muted-foreground">Top model: {performanceMetrics?.topModel || "N/A"}</p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card border-critical hover:shadow-security transition-all duration-300 animate-pulse-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">{alerts.length}</div>
              <p className="text-xs text-critical font-medium">
                {alerts.length > 0 ? "CRITICAL: Immediate attention required" : "No active threats"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Alerts Section */}
        <Card className="bg-card shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-critical" />
                Active Security Threats
              </CardTitle>
              <Button variant="outline" size="sm">View All Alerts</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p>No security threats detected</p>
                </div>
              ) : (
                alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg border border-border animate-slide-up">
                  <div className="flex-shrink-0">
                    <Badge variant="destructive" className="bg-critical text-critical-foreground">
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prompt: "{alert.prompt}"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>User: {alert.user}</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              )))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Prompts and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Prompt Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={prompt.severity === "CRITICAL" ? "destructive" : "default"}
                          className={prompt.severity === "CRITICAL" ? "bg-critical text-critical-foreground" : ""}
                        >
                          {prompt.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{prompt.model}</span>
                      </div>
                      <p className="text-sm truncate">{prompt.prompt}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>${prompt.spend.toFixed(6)}</span>
                        <span>{prompt.latency}</span>
                        <span className="text-success">{prompt.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                System Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-primary rounded-lg text-primary-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      HIGH
                    </Badge>
                    <span className="font-semibold">Security Alert</span>
                  </div>
                  <p className="text-sm">
                    Monitor the main user for potential overuse and ensure fair resource allocation.
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">MEDIUM</Badge>
                    <span className="font-semibold">Cost Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimize prompt and completion token usage to further reduce costs.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">LOW</Badge>
                    <span className="font-semibold">User Engagement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider promoting usage among more users to balance system load.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;