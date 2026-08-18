# Phase 7 — Initial AI Provider Decision

## Status

ACCEPTED

## Date

2026-08-18

## Phase

Phase 7 — AI / Creator Platform

## Decision Gate

Phase 7 Provider Decision

## Baseline

```text
FINAL PHASE 6 CLOSURE
ab75238ecab17b6251479fed871f654e955ed21a

SUBJECT
docs(roadmap): close Phase 6

PARENT
856c1e10c3f3a386a002aedcec4b182046706a7b
docs(roadmap): evaluate Phase 6 closure criteria

GITHUB ACTIONS
CI run 32146278147
CI #111
attempt 1
completed — success

PHASE COMPLETION TAG
phase-6-complete

REMOTE TAG OBJECT
20f7854f67b88b478bfc7a188cde4fdabdfd6e9e

TAG PEELED TARGET
ab75238ecab17b6251479fed871f654e955ed21a
```

## Decision

AI World selects:

```text
OpenAI API
```

as the **single initial AI Provider** for Phase 7.

This decision selects the Provider only.

It does **not** yet select:

```text
a concrete OpenAI model;

a model alias;

a model snapshot;

a Provider SDK version;

a Provider Adapter implementation;

an API credential;

a Provider-specific configuration schema.
```

The initial concrete model is selected during:

```text
P7-M02 — Initial Provider Adapter
```

using the requirements of the first real Generation capability and current
model-level quality, latency, cost, availability, rate-limit, and regional
evidence at that checkpoint.

P7-M01 remains Provider-neutral.

No OpenAI SDK is installed by this decision.

## Why Provider Selection Happens Now

The accepted roadmap requires Phase 7 to begin by selecting one initial
Provider before implementing the Provider Port and first Adapter.

Phase 6 has already established the required canonical capabilities:

```text
Identity
Knowledge
Media
Discovery
```

and the annotated:

```text
phase-6-complete
```

now marks the exact completed Phase 6 repository checkpoint.

The Phase 7 entry gate is therefore open.

## Current Phase 7 Need

The immediate roadmap sequence is:

```text
Provider Decision
    ↓
P7-M01 — AI Provider Port
    ↓
P7-M02 — Initial Provider Adapter
    ↓
P7-M03 — Generation Model
    ↓
P7-M04 — Text Generation
```

The first real AI capability is text-oriented.

Potential initial consumers include:

```text
creator drafting;

summarization;

Knowledge explanation;

source-grounded devotional explanation draft;

Scripture/source summary candidate;

Anime character summary draft.
```

AI World does not currently require an initial Provider to prove:

```text
autonomous Agents;

semantic/vector Search;

Provider-hosted canonical Knowledge;

Provider-native retrieval ownership;

multiple Providers;

image generation;

video generation;

Realtime voice;

fine-tuning.
```

Those capabilities remain separately gated.

## Provider Selection Criteria

The accepted Technology Strategy requires evaluation of:

```text
required modalities;

model quality;

tool/function capabilities;

structured output;

latency;

cost;

availability;

data handling;

safety;

rate limits;

SDK quality;

regional requirements.
```

At this entry checkpoint, these criteria are applied only to the current
Phase 7 needs.

## Candidate Set

The bounded candidate set evaluated is:

```text
OpenAI API

Anthropic Claude API

Google Gemini API
```

All three are credible current Provider candidates.

This decision does not classify Anthropic or Gemini as inadequate.

The architectural point of the Provider Port is precisely to keep a future
change possible without spreading Provider types through AI World.

## Capability Comparison

### Text generation

Current finding:

```text
OpenAI
SUPPORTED

Anthropic
SUPPORTED

Gemini
SUPPORTED
```

Text generation therefore does not by itself distinguish the candidates.

### Structured output

Current official Provider documentation shows schema-constrained structured
output support across all three candidates.

```text
OpenAI
JSON Schema Structured Outputs
strict schema mode available on supported models

Anthropic
JSON outputs
strict tool-use schema support on supported models

Gemini
JSON Schema structured output on supported models
```

This capability is important because later Phase 7 work requires:

```text
output schema validation;

structured candidate data;

canonical owner validation before acceptance.
```

AI World still validates normalized output itself.

Provider-level structured output does not replace AI World semantic
validation.

### Tool / function calling

Current official Provider documentation shows typed tool/function mechanisms
across all three candidates.

This supports the future:

```text
P7-M10 — AI Tool Baseline
```

without requiring that milestone now.

AI World Tools remain AI World-owned Contracts.

No Provider callback type may spread through Domain code.

### Usage and operational metadata

All three candidate APIs expose usage/token information sufficient to support
a future normalized operational record.

That is relevant to:

```text
P7-M11 — AI Usage Tracking
```

but P7-M11 is not implemented now.

### Multimodality

The initial required modality is:

```text
TEXT
```

OpenAI, Anthropic, and Gemini all have broader multimodal capabilities.

Those broader modalities are not used to manufacture requirements for P7-M01.

### Model quality

No cross-Provider quality benchmark is claimed by this ADR.

The project has not yet implemented the first Generation capability against
which such a benchmark could be made meaningful.

The initial model inside the selected Provider must therefore be chosen at
P7-M02 against a bounded acceptance test for the first real text-generation
capability.

### Latency and cost

No synthetic cross-Provider latency or cost winner is claimed here.

Both are model-specific and workload-specific.

P7-M02 must choose the initial model using current pricing and a bounded
real request shape instead of freezing a model based on Provider-level
marketing comparisons.

### Availability, rate limits, and regional requirements

These remain account, model, deployment, and region dependent.

AI World's production cloud/region is not yet frozen.

P7-M02 and later production-readiness gates must verify the actual selected
model/account constraints before relying on them operationally.

### Data handling

Data handling is a hard Adapter concern.

For OpenAI API usage, current official OpenAI documentation states that API
data is not used to train or improve OpenAI models unless the customer
explicitly opts in, while retention and application-state behavior vary by
endpoint and account controls.

The future OpenAI Adapter must therefore make retention behavior explicit
rather than relying on defaults.

Provider-side conversation state must not become canonical AI World state.

Sensitive context handling remains governed by AI World regardless of
Provider policy.

### SDK quality

AI World uses TypeScript/Node.js.

OpenAI, Anthropic, and Google each provide maintained JavaScript/TypeScript
developer surfaces.

The Provider SDK is therefore not permitted to define the AI World Provider
Contract.

## Why OpenAI Is Selected Initially

OpenAI is selected as the initial Provider because its current official
platform offers one direct path that aligns with the known Phase 7 sequence:

```text
text generation now
        ↓
schema-constrained output later
        ↓
custom typed function tools later
        ↓
broader multimodal capability if a real consumer requires it
```

The current OpenAI Responses API is the preferred Provider API surface for
P7-M02 evaluation.

This is an architectural-fit decision, not a universal model-quality ranking.

The tie-breaker is the combination of:

```text
official TypeScript SDK;

single current Responses API surface;

text generation;

strict structured output capability;

custom function/tool capability;

usage metadata;

documented API data controls.
```

Those capabilities match the already-accepted Phase 7 sequence without
requiring a large AI orchestration framework.

## Why Anthropic Is Not Selected Initially

Anthropic is technically viable.

It currently supports:

```text
text generation;

vision;

schema-constrained structured outputs;

strict tool use;

usage metadata;

official SDKs.
```

No current AI World requirement demonstrates that Anthropic-specific
capabilities justify making it the first Adapter instead of OpenAI.

Anthropic remains a valid future candidate if the Phase 7 Multi-Provider Gate
is later satisfied.

## Why Gemini Is Not Selected Initially

Gemini is technically viable.

It currently supports:

```text
text generation;

multimodal input;

JSON Schema structured output;

function calling;

usage metadata;

official SDKs.
```

No current AI World requirement demonstrates that Gemini-specific
capabilities justify making it the first Adapter instead of OpenAI.

Gemini remains a valid future candidate if the Phase 7 Multi-Provider Gate is
later satisfied.

## Provider Lock-In Control

Selecting OpenAI now does not make OpenAI part of AI World's canonical
architecture.

The ownership rule remains:

```text
AI World
owns
Provider Contract

OpenAI Adapter
implements
Provider Contract

OpenAI SDK
is private to
OpenAI Adapter
```

Provider-specific request/response types must not appear in:

```text
AI World Domain Models;

Knowledge;

Discovery;

Media;

Universe packages;

API transport Contracts;

canonical Generation records.
```

Where Provider/model provenance is needed, AI World stores normalized
identifiers rather than SDK objects.

## P7-M01 Consequence

P7-M01 should introduce the minimum Provider-neutral contract needed for the
next real capability.

Initial direction:

```text
AI / Creator package
@ai-world/platform-ai-creator

Provider Port
AI World-owned

initial operation
text generation only

Provider SDK dependency
NONE

Provider implementation
NONE

OpenAI import
NONE

API key
NONE
```

The first Port should not pretend to normalize every future Provider feature.

A minimal text-first boundary is sufficient.

Conceptually:

```text
AiProviderPort
    generateText(request)

AiProviderTextRequest
    instructions?
    input

AiProviderTextResult
    text
    model
```

The exact TypeScript naming remains a P7-M01 implementation detail and must be
validated against existing repository conventions.

Future milestones may extend the owned Port when a real capability requires:

```text
structured outputs;

typed Tools;

streaming;

additional modalities;

usage metadata.
```

Do not add those surfaces merely because the selected Provider supports them.

## Explicitly Rejected in This Decision

This checkpoint does not introduce:

```text
openai npm package;

@anthropic-ai/sdk;

@google/genai;

LangChain;

LlamaIndex;

Vercel AI SDK as canonical AI architecture;

MCP runtime;

Agent framework;

autonomous loop;

Provider-built web Search;

Provider-built file Search;

embeddings;

Vector Database;

Queue;

Worker;

AI database model;

Generation model;

AI API endpoint;

Web AI UI;

OpenAI API key;

Provider environment variable;

second Provider Adapter.
```

## Context and Retrieval Rule

Future AI context must flow through:

```text
Knowledge Contracts;

Discovery Contracts;

authorized User / Universe context.
```

The initial OpenAI Adapter must not query canonical database tables directly.

Provider-native retrieval features must not bypass AI World's authorization,
provenance, or canonical ownership.

## Safety Rule

Provider safety features are defense in depth.

They do not replace the Phase 7 AI World safety baseline.

AI World still owns:

```text
input validation;

permission checks;

tool restrictions;

output validation;

sensitive-data handling;

failure controls;

canonical acceptance.
```

## Multi-Provider Gate

Do not implement Anthropic, Gemini, or another second Provider unless evidence
appears such as:

```text
missing modality;

availability requirement;

cost benefit;

quality requirement;

regional requirement.
```

A future second Provider must implement the same AI World-owned boundary
rather than expanding canonical models with Provider-specific behavior.

## Decision Sources

Official Provider sources reviewed for this decision on 2026-08-18:

```text
OpenAI API Platform / Developer Quickstart
https://platform.openai.com/docs/quickstart

OpenAI API — Structured Outputs / API Reference
https://platform.openai.com/docs

OpenAI API — Data Controls
https://platform.openai.com/docs/models/default-usage-policies-by-endpoint

Anthropic Claude API — Structured Outputs
https://platform.claude.com/docs/en/build-with-claude/structured-outputs

Anthropic Claude API — Tool Use
https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview

Google Gemini API — Structured Outputs
https://ai.google.dev/gemini-api/docs/structured-output

Google Gemini API — Function Calling
https://ai.google.dev/gemini-api/docs/function-calling

Google Gemini API — Usage / Generate Content Reference
https://ai.google.dev/api/generate-content
```

These sources are evidence for the current decision date.

Provider capabilities, models, pricing, limits, and policies are expected to
evolve and must be rechecked when implementing the Adapter or when a later
decision depends on them.

## Decision Outcome

```text
PHASE 7 PROVIDER DECISION
ACCEPTED

INITIAL PROVIDER
OPENAI API

INITIAL PROVIDER API SURFACE
RESPONSES API
preferred for P7-M02 evaluation

CONCRETE MODEL
NOT SELECTED YET

PROVIDER SDK
NOT INSTALLED

MULTI-PROVIDER
NOT JUSTIFIED

P7-M01 — AI PROVIDER PORT
NEXT AFTER ROADMAP DECISION CLOSURE
```
