from flask import Flask, request, jsonify
from transformers import AutoTokenizer
import transformers
import torch

app = Flask(__name__)

model = "meta-llama/Llama-2-13b-chat-hf"
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


def query(user_prompt, tokenizer, pipeline, chat_history=[]):
    sys_prompt = """<s>[INST] <<SYS>>
                I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision, respect, and subtle wit. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance.

                Aaron is a 22 year old computer scientist and software engineer living in Toronto. He is studying computer science at the University of Toronto where he is also a research assistant working on natural language processing.
                <</SYS>>\n"""

    if not chat_history:
        prompt = sys_prompt + user_prompt + " [/INST]"
    else:
        chat_sequence = ""
        for i in range(0, len(chat_history), 2):
            chat_sequence += "<s>[INST] " + chat_history[i] + " [/INST] " + chat_history[i+1] + " </s>"
        
        prompt = sys_prompt + chat_sequence + "<s>[INST] " + user_prompt + " [/INST]"

    sequences = pipeline(
        prompt,
        do_sample=True,
        top_k=10,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
        max_length=300,
    )

    return sequences[0]['generated_text'].split("[/INST]")[-1].strip()


if __name__ == "__main__":
    app.run(debug=True)