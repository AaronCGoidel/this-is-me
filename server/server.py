from flask import Flask, request, jsonify
from transformers import AutoTokenizer
import transformers
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CORS(app, resources={r"/query": {"origins": "http://localhost:3000"}})

# model = "meta-llama/Llama-2-13b-chat-hf"
model = "meta-llama/Llama-2-7b-chat-hf"

print("[MODEL] Loading model:", model)

tokenizer = AutoTokenizer.from_pretrained(model, use_auth_token=True)
pipeline = transformers.pipeline(
    "text-generation",
    model=model,
    torch_dtype=torch.float16,
    device_map="auto",
)

@app.route('/query', methods=['POST'])
def get_response():
    user_prompt = request.json.get('user_prompt', '')
    chat_history = request.json.get('chat_history', [])

    response = query(user_prompt, tokenizer, pipeline, chat_history)

    return jsonify({"response": response})


def query(user_prompt, tokenizer, pipeline, chat_history=[], response_length=60):
    sys_prompt = """<s>[INST] <<SYS>>
                I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision and respect. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance.

                Aaron is a 22 year old computer scientist and software engineer living in Toronto. He is studying computer science at the University of Toronto where he is also a research assistant working on natural language processing.
                <</SYS>>\n"""

    if not chat_history:
        prompt = sys_prompt + user_prompt + " [/INST]"
    else:
        chat_sequence = ""
        for i in range(0, len(chat_history), 2):
            chat_sequence += "<s>[INST] " + chat_history[i] + " [/INST] " + chat_history[i+1] + " </s>"
        
        prompt = sys_prompt + chat_sequence + "<s>[INST] " + user_prompt + " [/INST]"
    
    print("[MODEL] Prompting model with:\n", prompt)

    prompt_tokens = tokenizer.encode(prompt, return_tensors="pt")
    n_prompt_tokens = prompt_tokens.shape[1]
    print("[MODEL] Prompt size: {} tokens".format(n_prompt_tokens))
    n_res_tokens = response_length + n_prompt_tokens

    sequences = pipeline(
        prompt,
        do_sample=True,
        top_k=10,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
        max_length=n_res_tokens,
    )

    return sequences[0]['generated_text'].split("[/INST]")[-1].strip()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)