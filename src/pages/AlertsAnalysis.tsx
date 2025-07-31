import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, AlertTriangle, DollarSign, Clock, User, Calendar, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLiteLLMLogs } from "@/hooks/useLiteLLMLogs";

const AlertsAnalysis = () => {
  const navigate = useNavigate();
  const { data: logs, isLoading } = useLiteLLMLogs(500); // Get more logs for analysis
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = log.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const severity = (log.security_analysis as any)?.severity || "LOW";
    const matchesSeverity = severityFilter === "all" || severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  }) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-critical text-critical-foreground border-critical/50";
      case "HIGH":
        return "bg-destructive text-destructive-foreground border-destructive/50";
      case "MEDIUM":
        return "bg-warning text-warning-foreground border-warning/50";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading analysis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Header */}
      <div className="bg-gradient-primary border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-background/10 border-primary/30 text-foreground hover:bg-background/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Security & Performance Analysis
              </h1>
              <p className="text-muted-foreground mt-1">
                Detailed analysis of all prompts and system performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search prompts or users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Analysis Results ({filteredLogs.length} entries)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => {
                    const severity = (log.security_analysis as any)?.severity || "LOW";
                    const hasSecurityAnalysis = log.security_analysis;
                    const hasPerformanceAnalysis = log.performance_cost_analysis;
                    
                    return (
                      <div
                        key={log.id}
                        className={`group p-4 rounded-xl border transition-smooth cursor-pointer hover:shadow-glow ${
                          selectedLog?.id === log.id
                            ? "border-primary/50 bg-primary/5"
                            : "border-border/50 bg-gradient-to-r from-muted/20 to-muted/10"
                        }`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getSeverityColor(severity)}>
                              {severity}
                            </Badge>
                            {hasSecurityAnalysis && (
                              <Badge variant="outline" className="border-critical/30 text-critical">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Security
                              </Badge>
                            )}
                            {hasPerformanceAnalysis && (
                              <Badge variant="outline" className="border-warning/30 text-warning">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Performance
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-foreground mb-3 line-clamp-2">
                          {log.prompt || "No prompt available"}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user_id || "Unknown"}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${(log.spend || 0).toFixed(6)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.latency_sec ? `${log.latency_sec}s` : "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {log.created_at ? new Date(log.created_at).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No entries match your filters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Log Details */}
          <div className="space-y-6">
            <Card className="bg-gradient-card shadow-card border-border/50 sticky top-6">
              <CardHeader>
                <CardTitle>
                  {selectedLog ? "Analysis Details" : "Select Entry"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLog ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Request Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Model:</span> {selectedLog.model || "N/A"}</div>
                        <div><span className="font-medium">Status:</span> {selectedLog.status || "N/A"}</div>
                        <div><span className="font-medium">Tokens:</span> {selectedLog.total_tokens || "N/A"}</div>
                        <div><span className="font-medium">Cost:</span> ${(selectedLog.spend || 0).toFixed(6)}</div>
                      </div>
                    </div>

                    {/* Security Analysis */}
                    {selectedLog.security_analysis && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-critical">Security Analysis</h4>
                        <div className="p-4 bg-critical/5 border border-critical/20 rounded-lg">
                          <pre className="text-xs text-foreground whitespace-pre-wrap">
                            {JSON.stringify(selectedLog.security_analysis, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Performance Analysis */}
                    {selectedLog.performance_cost_analysis && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-warning">Performance Analysis</h4>
                        <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                          <pre className="text-xs text-foreground whitespace-pre-wrap">
                            {JSON.stringify(selectedLog.performance_cost_analysis, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Full Prompt */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Full Prompt</h4>
                      <div className="p-4 bg-muted/20 border border-border/50 rounded-lg max-h-40 overflow-y-auto">
                        <p className="text-xs text-foreground whitespace-pre-wrap">
                          {selectedLog.prompt || "No prompt available"}
                        </p>
                      </div>
                    </div>

                    {/* Response */}
                    {selectedLog.response_text && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">Response</h4>
                        <div className="p-4 bg-muted/20 border border-border/50 rounded-lg max-h-40 overflow-y-auto">
                          <p className="text-xs text-foreground whitespace-pre-wrap">
                            {selectedLog.response_text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select an entry from the list to view detailed analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsAnalysis;