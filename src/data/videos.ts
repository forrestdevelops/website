export interface Video {
  title: string;
  description: string;
  topic: string;
  /** Set when published; null = coming soon. */
  url: string | null;
}

export const videos: Video[] = [
  {
    title: "OpenTelemetry Collector from Zero",
    description: "Stand up a collector, receive OTLP, sample and filter, and ship to Grafana Cloud. The control plane from the State of Observability post, built live.",
    topic: "observability",
    url: null,
  },
  {
    title: "Raspberry Pi Network Monitor",
    description: "A Pi 4, Prometheus and Grafana watching real network KPIs, so the next time someone says 'the internet is slow' you have the graph.",
    topic: "homelab",
    url: null,
  },
  {
    title: "Tracing an AI Agent on AWS Bedrock",
    description: "Spans for every model and tool call, token and cost metrics, and what the OTel GenAI conventions look like in practice.",
    topic: "agentic AI",
    url: null,
  },
  {
    title: "SLOs That Map to the Business",
    description: "Turning 'is it up?' into SLIs and error budgets leadership actually understands, with alerting that only pages when users hurt.",
    topic: "SRE",
    url: null,
  },
  {
    title: "Server Room Build: Rack, Drops and NAS",
    description: "Racking gear, patching network drops and moving a NAS and Hyper-V host into a new building, start to finish.",
    topic: "IT leadership",
    url: null,
  },
  {
    title: "Grafana Dashboards People Actually Use",
    description: "One question per dashboard, an owner for each, and how to retire the 40-panel wall nobody reads.",
    topic: "observability",
    url: null,
  },
];
