import { raw } from "../../lib/html.js";
import type { Post } from "../posts.js";

export const stateOfObservability2026: Post = {
  slug: "state-of-observability-2026",
  title: "The State of Observability in 2026",
  summary:
    "OpenTelemetry won the instrumentation war, the bill became the problem, the vendors consolidated, and now we have to observe AI agents too. Here's where things actually stand, from someone who's run these tools for a living.",
  date: "2026-10-14",
  tags: ["observability", "opentelemetry", "agentic AI", "SRE"],
  body: raw(`
<p class="lede">I've spent most of my career on observability: tuning AppDynamics agents, building Splunk ITSI services, rolling out Datadog and Dynatrace, and running APM and agentic AI engagements as a consultant. Now I'm a CIO, so I sign the checks too. That changes how you look at a telemetry bill.</p>

<p>This is my take on where observability stands in late 2026: what's settled, what's still a mess, and what I'd do if I were starting from scratch today.</p>

<h2 id="otel-won">1. OpenTelemetry won. Now act like it.</h2>

<p>A few years ago, choosing an observability vendor meant choosing their agent, and their agent meant lock-in. That fight is over. OpenTelemetry is the default way to instrument new code, and every serious vendor accepts OTLP. In Elastic's 2026 landscape survey of public-sector IT leaders, 81% said they're already using or evaluating OTel. That's a sector that usually moves last.</p>

<p>The bigger shift is that the <strong>OTel Collector has become the control plane</strong>. Once all your telemetry flows through a collector you own, you decide what gets sampled, what gets dropped, what gets enriched and where it goes. The backend becomes a choice you can revisit instead of a marriage.</p>

<p>When I sketched out the observability stack for a Laravel platform at work, the shape was simple:</p>

<ul>
  <li>PHP auto-instrumentation on the app and Faro for real-user monitoring in the Vue front end</li>
  <li>An OTel Collector in the middle doing the routing and filtering</li>
  <li>Tempo, Loki and Mimir behind it on Grafana Cloud for traces, logs and metrics</li>
</ul>

<p>None of those layers needs to know about the others, and that's the point.</p>

<p><strong>What I'd do:</strong> instrument everything new with OTel, put a collector between your apps and every backend, and stop writing vendor-specific instrumentation code. Keep proprietary agents only where they still beat OTel, like deep code-level diagnostics on legacy Java and .NET apps.</p>

<h2 id="cost">2. The bill is now the main problem</h2>

<p>The most common conversation I have about observability isn't about visibility. It's about money. Telemetry volume grows faster than the business does. Every new microservice, container and debug log line adds to the bill, and most of that data is never looked at.</p>

<p>Elastic's survey found that 66% of respondents regularly hit unexpected observability costs, and 95% are actively trying to cut them. That matches what I've seen on both sides of the table.</p>

<p>The fixes are known. They just take discipline:</p>

<ul>
  <li><strong>Sample traces deliberately.</strong> Keep 100% of errors and slow requests, and a small fraction of healthy ones. Tail-based sampling in the collector is how you get there.</li>
  <li><strong>Treat logs as the expensive signal.</strong> If you're counting something with log lines, emit a metric instead. Drop DEBUG in production at the collector, not in a ticket you'll get to someday.</li>
  <li><strong>Watch metric cardinality.</strong> One label with a user ID or request ID in it can cost more than an entire service.</li>
  <li><strong>Tier your retention.</strong> Hot storage for days, cheap object storage for months. Most investigations happen in the first 72 hours.</li>
  <li><strong>Show teams what they cost.</strong> Usage dashboards by service change behavior faster than any policy memo.</li>
</ul>

<p><strong>What I'd do:</strong> put a monthly telemetry budget next to your cloud budget and review them together. If you can't say what a service's telemetry costs, you can't manage it.</p>

<h2 id="consolidation">3. The vendor landscape consolidated</h2>

<p>Cisco closed its $28B Splunk acquisition in March 2024, then folded AppDynamics into the Splunk observability org. AppDynamics is now positioned for traditional three-tier apps, Splunk Observability Cloud for cloud-native work, and the two share data and interfaces. Cisco's own Full-Stack Observability platform gave way to Splunk Observability Cloud.</p>

<p>I worked with these tools before and after that shift, so here's my honest read. The big platforms (Splunk/AppDynamics, Datadog, Dynatrace) are all good, and they're all converging on the same pitch: one platform, every signal, AI on top. The differences are now pricing models, how well they handle OTel data compared with their own agents, and how much you're willing to commit.</p>

<p>Meanwhile, the open stack — Prometheus, Grafana, Tempo, Loki, Mimir — has grown up. You can self-host it or buy it managed, and since it's OTel-native, you can move between the two.</p>

<p><strong>What I'd do:</strong> choose a backend for what it does with the data — analytics, alerting, correlation, price — not for how you collect it. If collection is OTel and the collector is yours, switching vendors becomes a project instead of a rewrite.</p>

<h2 id="ai-agents">4. We have to observe AI agents now</h2>

<p>This is the new frontier, and it's where I've spent a lot of time lately building agentic AI on AWS Bedrock. Agents break a lot of assumptions traditional APM was built on:</p>

<ul>
  <li><strong>The same input doesn't produce the same path.</strong> An agent might call two tools or seven, and loop or not.</li>
  <li><strong>Latency and cost come from tokens, not just CPU.</strong> One slow, chatty agent run can cost more than a thousand normal requests.</li>
  <li><strong>"It returned 200" doesn't mean it worked.</strong> The answer can be wrong, off-policy or hallucinated, and the HTTP status won't tell you.</li>
</ul>

<p>OpenTelemetry is working on this through its GenAI semantic conventions: a standard way to trace an agent run as a span tree, with <code>invoke_agent</code> at the root and <code>chat</code> and <code>execute_tool</code> spans underneath, plus token counts and model details as attributes. Tool calls over MCP use the same vocabulary. As of mid-2026, though, those conventions are still marked <em>Development</em>, not stable, and attribute names can still change.</p>

<p><strong>What I'd do:</strong> trace your agents now anyway. Wrap every model call and tool call in a span, record tokens in and out, the model, the tool name and the outcome, and keep the attribute mapping in one place so a convention rename is a one-line fix. Add evaluation signals (did the answer pass your checks?) next to the latency and cost metrics. An agent you can't trace is an agent you can't put in front of customers.</p>

<h2 id="ai-ops">5. AI for observability is real, with caveats</h2>

<p>The other side of the AI story is using it to run operations: assistants that write queries, summarize incidents and suggest root causes. Elastic's survey found 84% of respondents already use GenAI somewhere in their observability work.</p>

<p>From what I've seen, it's genuinely useful for the toil: translating "show me checkout errors by region since the deploy" into a query, drafting the incident timeline, and pointing you at the right dashboard at 2 a.m. It's less trustworthy at actually deciding root cause, because it's only as good as the telemetry and context underneath. If your service names are inconsistent and your traces are broken, AI just gets to the wrong answer faster.</p>

<p><strong>What I'd do:</strong> use the assistants, but invest in the boring foundation they depend on: consistent service names and resource attributes, connected traces, and a service catalog. That's what makes both humans and AI effective.</p>

<h2 id="slos">6. The fundamentals still decide who's good at this</h2>

<p>Underneath all the trends, the teams that are good at observability do the same unglamorous things:</p>

<ul>
  <li><strong>SLOs tied to business outcomes.</strong> Not "CPU under 80%" but "contractors can submit an order in under two seconds, 99.5% of the time." Map your SLIs to the things the business actually cares about.</li>
  <li><strong>Alert on symptoms, not causes.</strong> Page a human when users are hurting or the error budget is burning fast. Everything else is a dashboard or a ticket.</li>
  <li><strong>Dashboards that answer a question.</strong> Each one should have an owner and a purpose, not 40 panels nobody reads.</li>
  <li><strong>Observe the infrastructure you forget about.</strong> Networks, Wi-Fi, the firewall, the NAS in the closet. I run a Raspberry Pi with Prometheus and Grafana just to watch our network KPIs, because "the internet is slow" is still the most common incident there is.</li>
</ul>

<h2 id="starting-over">If I were starting from scratch today</h2>

<ol>
  <li>Standardize on OpenTelemetry for instrumentation, with consistent service names and resource attributes from day one.</li>
  <li>Run the collector yourself and do sampling, filtering and routing there.</li>
  <li>Define three to five SLOs for the journeys that make money, and alert only on those.</li>
  <li>Choose a backend on analytics and price, and keep the exit door open.</li>
  <li>Give telemetry a budget and a monthly review.</li>
  <li>Trace AI agents like any other critical service: spans, tokens, cost and quality.</li>
  <li>Let AI assistants take the toil, not the judgment.</li>
</ol>

<p>Observability in 2026 isn't really a tooling problem anymore. The tools are good and mostly interchangeable. It's a discipline problem: collecting the right data, paying the right amount for it, and turning it into decisions. That part hasn't changed, and I don't think it will.</p>

<p>Coming up on the blog and the channel: hands-on builds of the pieces above, starting with an OTel Collector from zero and the Raspberry Pi network monitor. Follow along on <a href="https://github.com/forrestdevelops">GitHub</a>.</p>

<aside class="sources">
  <h2>Sources</h2>
  <ul>
    <li><a href="https://www.elastic.co/industries/public-sector/landscape-observability-report">Elastic / Dimensional Research — The Landscape of Observability in 2026 (public sector)</a></li>
    <li><a href="https://techtarget.com/searchitoperations/news/366588642/New-Cisco-Splunk-observability-roadmap-details-emerge">TechTarget — New Cisco-Splunk observability roadmap details emerge</a></li>
    <li><a href="https://dev.to/azena-ai/opentelemetrys-genai-semantic-conventions-are-not-stable-yet-heres-what-actually-shipped-in-2026-3mke">OpenTelemetry's GenAI semantic conventions are not stable yet: what actually shipped in 2026</a></li>
  </ul>
</aside>
`),
};
