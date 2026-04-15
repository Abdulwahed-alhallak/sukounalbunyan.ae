# Noble Architecture — AIAssistant Module Deep Dive

## 1. AI Orchestration (`AIService.php`)

The system acts as a multi-modal gateway supporting three major AI providers out-of-the-box.

### Supported Providers:
- **OpenAI**: Uses `gpt-4` / `gpt-3.5-turbo` chat completions.
- **Anthropic**: Uses Claude models via the `/v1/messages` endpoint.
- **Google Gemini**: Uses the `generateContent` API with specific handling for safety filters.

### Smart Logic:
- **Dynamic Configuration**: Provider, model, and API keys are fetched per-company (`creatorId()`).
- **Creativity Control**: Maps human-readable levels (`low`, `medium`, `high`) to technical `temperature` values (0.3 to 1.0).
- **Error Normalization**: High-quality error handling in `AIGeneratorController` to provide user-friendly messages for rate limits, safety blocks, and configuration issues.

---

## 2. Programmable Prompt Layer (`AIPrompt.php`)

Instead of hardcoded prompts, the system uses a hierarchical database-driven template engine.

### Resolution Logic:
1. **Specific Match**: (Module + Submodule + FieldType) — e.g., `HRM` + `Employee` + `Bio`.
2. **Module Match**: (Module + FieldType) — e.g., `HRM` + `Bio`.
3. **General Fallback**: (`general` + FieldType) — Global defaults.

---

## 3. Integration Points

The AIAssistant is not a standalone silo but is injected across the entire ecosystem:
- **CRM (Lead/Deal)**: Generating deal notes, follow-up emails, and market reports.
- **HRM**: Generating job descriptions, employee performance feedback, and policy documents.
- **Reporting**: Summarizing financial data into executive insights.

---

## 4. Technical Implementation Detail

### Request Lifecycle:
1. Frontend calls `AIGeneratorController@generate`.
2. Controller passes `fieldType`, `settings`, and `context` to `AIService`.
3. `AIService` uses `PromptBuilder` to assemble the final string using data from the `ai_prompts` table.
4. The service routes the request to the configured API provider.
5. Results are returned as an array (supporting multiple variants if requested).
