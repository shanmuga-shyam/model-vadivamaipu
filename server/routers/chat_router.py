from fastapi import APIRouter, HTTPException
import importlib
import os

router = APIRouter()

@router.post("/explain")
async def explain_results(data: dict):
    """
    Takes model evaluation JSON and returns an AI-written summary.
    """
    try:
        genai = importlib.import_module("google.generativeai")
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="google.generativeai is not installed; install the 'google-generative-ai' package."
        )

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""
    You are an AI assistant for an ML evaluation platform.
    Analyze these model results and write a human-readable summary with:
    - The best performing model
    - Comparison of R², MSE, MAE
    - Recommendations for the user
    Data: {data}
    """

    response = model.generate_content(prompt)
    return {"summary": response.text}


@router.post("/chat")
async def chat_endpoint(payload: dict):
    """
    Generic chat endpoint that accepts:
    - context: user-provided context string
    - message: the user's message / instruction
    - mode: "model" or "agent" (decides behaviour)
    - model_name: optional model identifier
    Returns: { "reply": "..." }
    """
    context = payload.get("context", "")
    message = payload.get("message", "")
    mode = payload.get("mode", "model")
    model_name = payload.get("model_name") or "gemini-pro"
    # optional conversation history: list of {role: 'user'|'assistant', content: str}
    history = payload.get("history") or []

    # Attempt to use google.generativeai if available
    try:
        genai = importlib.import_module("google.generativeai")
    except ImportError:
        genai = None

    if mode == "model":
        if genai is None:
            raise HTTPException(
                status_code=500,
                detail="google.generativeai is not installed; install the 'google-generative-ai' package."
            )

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel(model_name)

        # System prompt: instruct the assistant about the application domain so it answers with authority.
        system_prompt = (
            "You are an expert assistant for the Model Vadivamaipu AutoML application. "
            "The user will ask about datasets, model training, evaluation metrics (R2, MSE, MAE), and next steps. "
            "Always answer concisely, reference metrics when present, compare models by metric values, "
            "provide clear actionable recommendations, and include example commands or code snippets when relevant. "
            "If the user provides dataset or results JSON, analyze it and highlight the best model, strengths and weaknesses, "
            "and any data quality issues. Keep responses safe and avoid hallucination; if information is missing, ask for it."
        )

        # Build combined prompt with optional history to maintain context
        parts = [system_prompt]
        if context:
            parts.append(f"Context: {context}")

        # Include short history if provided
        if isinstance(history, list) and history:
            hist_text = []
            for h in history:
                role = h.get("role", "user")
                content = h.get("content", "")
                hist_text.append(f"{role.upper()}: {content}")
            parts.append("Conversation history:\n" + "\n".join(hist_text))

        parts.append(f"User message: {message}")

        prompt = "\n\n".join(parts)

        response = model.generate_content(prompt)
        return {"reply": response.text}

    # agent mode: provide an actionable plan / suggestion. Prefer to use model if available.
    if mode == "agent":
        if genai is not None:
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel(model_name)

            prompt = f"""
            You are an autonomous assistant that provides action plans for tasks.
            Given this context and user request, produce a short actionable plan with numbered steps.
            Context: {context}
            Request: {message}
            Return only the plan and short description.
            """

            response = model.generate_content(prompt)
            return {"reply": response.text}

        # fallback simple agent suggestion
        plan = [
            "Review the provided context and identify the core task.",
            "Select a model or approach suitable for the task.",
            "Prepare data and run the evaluation or transformation.",
            "Return results and recommendations to the user."
        ]
        reply = f"Agent suggestion (fallback):\nTask summary: {message}\nPlan:\n" + "\n".join([f"{i+1}. {s}" for i, s in enumerate(plan)])
        return {"reply": reply}

    raise HTTPException(status_code=400, detail="Invalid mode; expected 'model' or 'agent'.")
