import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, DollarSign, Clock, Users, Zap, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import heroImage from "@/assets/dashboard-hero.jpg";
import { useLiteLLMLogs, useSecurityAlerts, usePerformanceMetrics, useOverallPerformance } from "@/hooks/useLiteLLMLogs";

const Dashboard = () => {
  const { data: logs, isLoading: logsLoading } = useLiteLLMLogs(50);
  const { data: securityAlerts, isLoading: alertsLoading } = useSecurityAlerts();
  const { data: performanceMetrics, isLoading: metricsLoading } = usePerformanceMetrics();
  const { data: overallPerf, isLoading: overallPerfLoading } = useOverallPerformance();

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
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/95 to-primary-glow/20" />
        <img 
          src={heroImage} 
          alt="DevSecOps Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6 animate-fade-in">
              <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI DevSecOps Control Center
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">System Online</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Real-time monitoring and security analysis for LLM operations powered by n8n and LiteLLM
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <Card className="group bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-smooth hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Requests</CardTitle>
              <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-smooth">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                {performanceMetrics?.totalRequests.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Total API calls processed</p>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-smooth hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Spend</CardTitle>
              <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-smooth">
                <DollarSign className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                ${performanceMetrics?.totalSpend || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Avg. latency: {performanceMetrics?.avgLatency || "0s"}
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-smooth hover:scale-[1.02] backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Success Rate</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-smooth">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                {performanceMetrics?.successRate || "0%"}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Top model: {performanceMetrics?.topModel || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-critical/5 to-critical/10 shadow-security border-critical/30 hover:shadow-security transition-smooth hover:scale-[1.02] animate-pulse-glow backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-critical">Security Alerts</CardTitle>
              <div className="p-2 bg-critical/20 rounded-lg group-hover:bg-critical/30 transition-smooth">
                <AlertTriangle className="h-4 w-4 text-critical" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-critical mb-1">{alerts.length}</div>
              <p className="text-xs text-critical font-semibold">
                {alerts.length > 0 ? "CRITICAL: Immediate attention required" : "No active threats"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Executive Summary */}
        <Card className="col-span-full bg-gradient-to-br from-primary/5 via-background to-primary-glow/5 shadow-glow border-primary/20 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">Executive Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {overallPerfLoading ? (
              <div className="text-center py-4">Loading executive summary...</div>
            ) : overallPerf ? (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {overallPerf.summary}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {overallPerf.findings?.map((finding: any, index: number) => (
                    <div key={index} className="group p-6 rounded-xl bg-gradient-card border border-border/50 hover:shadow-glow transition-smooth hover:scale-[1.02]">
                      <h4 className="font-bold text-primary mb-3 text-lg group-hover:text-primary-glow transition-smooth">
                        {finding.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{finding.detail}</p>
                    </div>
                  ))}
                </div>

                {overallPerf.recommendations && overallPerf.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Key Recommendations</h4>
                    <div className="space-y-2">
                      {overallPerf.recommendations.slice(0, 3).map((rec: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-card border border-border/30 hover:shadow-glow transition-smooth">
                          <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            rec.priority === 'HIGH' ? 'bg-critical/20 text-critical border border-critical/30' :
                            rec.priority === 'MEDIUM' ? 'bg-warning/20 text-warning border border-warning/30' :
                            'bg-muted/30 text-muted-foreground border border-border/50'
                          }`}>
                            {rec.priority}
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{rec.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group p-6 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-glow transition-smooth">
                    <h4 className="font-bold text-success mb-3 text-lg group-hover:text-success/80 transition-smooth">System Health</h4>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                  <div className="group p-6 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 hover:shadow-glow transition-smooth">
                    <h4 className="font-bold text-warning mb-3 text-lg group-hover:text-warning/80 transition-smooth">Cost Efficiency</h4>
                    <p className="text-sm text-muted-foreground">Within budget targets</p>
                  </div>
                  <div className="group p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-glow transition-smooth">
                    <h4 className="font-bold text-primary mb-3 text-lg group-hover:text-primary-glow transition-smooth">Security Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {(securityAlerts?.length || 0) > 0 ? 
                        `${securityAlerts?.length} alert(s) detected` : 
                        "No active threats"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Security Alerts Section */}
        <Card className="bg-gradient-card shadow-security border-critical/30 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-critical/5 to-transparent">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-critical/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-critical" />
                </div>
                <span className="text-xl font-bold">Active Security Threats</span>
              </CardTitle>
              <Button variant="outline" size="sm" className="border-critical/30 text-critical hover:bg-critical/10">
                View All Alerts
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-4 bg-success/10 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-16 w-16 text-success" />
                  </div>
                  <p className="text-lg font-semibold text-success">No security threats detected</p>
                  <p className="text-sm mt-2">Your system is secure and protected</p>
                </div>
              ) : (
                alerts.map((alert) => (
                <div key={alert.id} className="group flex items-start gap-6 p-6 bg-gradient-to-r from-critical/5 to-critical/10 rounded-xl border border-critical/30 hover:shadow-security transition-smooth animate-slide-up">
                  <div className="flex-shrink-0">
                    <Badge className="bg-critical text-critical-foreground border-critical/50 font-semibold px-3 py-1">
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground text-lg mb-2">{alert.title}</h4>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      Prompt: "{alert.prompt}"
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="font-medium">User: {alert.user}</span>
                      <span className="font-medium">Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-critical/30 text-critical hover:bg-critical/10 group-hover:scale-105 transition-smooth">
                    Investigate
                  </Button>
                </div>
              )))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-card shadow-card border-border/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold">Recent Prompt Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <div key={prompt.id} className="group flex items-start gap-4 p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/50 hover:shadow-glow transition-smooth">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          className={`font-semibold ${
                            prompt.severity === "CRITICAL" ? "bg-critical text-critical-foreground border-critical/50" : 
                            "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {prompt.severity}
                        </Badge>
                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">{prompt.model}</span>
                      </div>
                      <p className="text-sm text-foreground mb-3 leading-relaxed line-clamp-2">{prompt.prompt}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="font-medium text-warning">${prompt.spend.toFixed(6)}</span>
                        <span className="font-medium text-muted-foreground">{prompt.latency}</span>
                        <span className="font-medium text-success">{prompt.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold">System Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="group p-6 bg-gradient-to-br from-critical/10 to-critical/5 rounded-xl border border-critical/30 hover:shadow-security transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-critical text-critical-foreground border-critical/50 font-bold px-3 py-1">
                      HIGH
                    </Badge>
                    <span className="font-bold text-critical text-lg">Security Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor the main user for potential overuse and ensure fair resource allocation.
                  </p>
                </div>
                
                <div className="group p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/30 hover:shadow-glow transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-warning text-warning-foreground border-warning/50 font-bold px-3 py-1">
                      MEDIUM
                    </Badge>
                    <span className="font-bold text-warning text-lg">Cost Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Optimize prompt and completion token usage to further reduce costs.
                  </p>
                </div>

                <div className="group p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/50 hover:shadow-glow transition-smooth">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-muted text-muted-foreground border-border font-bold px-3 py-1">
                      LOW
                    </Badge>
                    <span className="font-bold text-muted-foreground text-lg">User Engagement</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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