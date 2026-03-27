from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing)
# This is required so that your Node.js/React frontend running on a different port (e.g., 5173)
# can successfully send HTTP requests to this Python API running on port 8000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLTK dependencies and stemmer
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words("english"))
port_stem = PorterStemmer()

# Load our high-accuracy ML models
try:
    model = pickle.load(open('model.pkl', 'rb'))
    vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
except Exception as e:
    print("Error loading models - ensure they are generated in the Jupyter notebook!")

# Define the expected JSON data structure from the React frontend
class NewsRequest(BaseModel):
    text: str

def clean_text(news):
    """Identical cleaning function to ensure identical vectorization"""
    if not isinstance(news, str):
        return ""
    news = news.lower()
    news = re.sub(r'[^a-z ]', '', news)
    words = news.split()
    return " ".join([port_stem.stem(w) for w in words if w not in stop_words])

@app.post("/predict")
def predict_news(request: NewsRequest):
    clean = clean_text(request.text)
    vector = vectorizer.transform([clean])
    
    # Validation step to ensure enough words are recognized
    if vector.nnz < 25:
        return {
            "status": "warning",
            "message": f"Insufficient Data to Verify! Only {vector.nnz} news-related words recognized."
        }
    
    # Generate prediction and probability scores
    probabilities = model.predict_proba(vector)[0]
    prob_fake = float(probabilities[1])
    prob_real = float(probabilities[0])

    if prob_fake > 0.95:
        return {"status": "success", "prediction": "Fake News", "confidence": prob_fake}
    elif prob_real > 0.50:
        return {"status": "success", "prediction": "Real News", "confidence": prob_real}
    else:
        return {"status": "warning", "message": "Unrelated Text or Insufficient Data to Verify"}
        
# Auto-reload triggered to load fresh harmonized model!
