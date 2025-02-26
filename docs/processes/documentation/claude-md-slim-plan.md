# Slim CLAUDE.md Plan

## Overview

This document outlines the plan for creating and maintaining a slimmed-down version of CLAUDE.md specifically optimized for AI agent interactions to reduce token usage and costs.

## Goals

- Create an AI-optimized CLAUDE.md that reduces token usage by 70%+
- Maintain all critical information needed for correct AI operation
- Establish formatting standards that improve AI parsing efficiency
- Document the process for future maintenance

## Background

CLAUDE.md serves as our primary reference document for development practices, documentation standards, and project organization. While the detailed, narrative style works well for human developers, it results in high token consumption when processed by AI agents, leading to:

1. Higher API costs
2. Slower processing times
3. Longer response times
4. Unnecessary context processing

## Implementation Strategy

Our implementation follows a four-part strategy:

### 1. Information Prioritization

We identified the most critical information the AI must have to:
- Follow our git workflow processes
- Use the correct build commands
- Adhere to code standards
- Create proper documentation
- Implement effective tests
- Understand project architecture

### 2. AI-Specific Formatting

We implemented specialized formatting to improve AI parsing:
- Added `<AI-CRITICAL>` tags to highlight must-follow sections
- Structured the document hierarchically from most to least critical
- Used consistent patterns for similar types of information
- Employed formatting that reduces token count (bullet points, commands)

### 3. Verbosity Reduction

We reduced verbosity through:
- Converting paragraphs to bullet points
- Removing duplicate information
- Replacing explanations with direct links
- Using imperative statements instead of narrative descriptions
- Focusing on "what to do" rather than "why to do it"

### 4. Readability Balance

While optimizing for AI, we maintained human readability by:
- Preserving clear section headers
- Using consistent formatting patterns
- Maintaining all critical links to detailed documentation
- Including context for recent project work

## Maintenance Process

To maintain the slim CLAUDE.md going forward:

1. When updating the human-readable documentation, also update the slim version
2. Preserve the `<AI-CRITICAL>` tags and concise formatting
3. Resist adding verbose explanations to the slim version
4. Test significant changes with AI interactions to verify token reduction
5. Update both versions when project processes change

## Expected Outcomes

The slim CLAUDE.md implementation should result in:
- 70-75% token reduction for AI processing
- Faster AI response times
- Lower API costs
- Improved AI understanding of critical requirements
- More efficient developer-AI interactions

## Success Metrics

We will measure success through:
1. Comparing token usage before and after implementation
2. Timing AI response speeds for common tasks
3. Tracking API costs over time
4. Evaluating AI adherence to critical processes
5. Gathering developer feedback on AI interaction quality