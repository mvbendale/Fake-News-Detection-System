# 📰 Fake News Detection System (2026 Edition)

An advanced, enterprise-grade Machine Learning system designed to accurately classify news articles as **Real** or **Fake**. This project utilizes a massive **117,000-row NLP dataset**, a meticulously tuned `LogisticRegression` model, and a decoupled **FastAPI + React/Vite** microservice architecture.

---

## 🏗️ Architecture Stack
This project operates on a decoupled architecture, separating the heavy Machine Learning background processes from the modern UI frontend:

*   **Brain (Backend):** Python, FastAPI, `scikit-learn`, `nltk`, `pandas`
*   **Beauty (Frontend):** Node.js, Vite, React, Vanilla CSS (Glassmorphism UI)

---

## 🧠 The Machine Learning Pipeline
Our system dynamically processes unstructured text using an immense pipeline before making a statistical prediction.

### 1. The Ultimate Dataset (117,250 Rows)
Our AI was trained on a meticulously curated mega-dataset to ensure extremely high vocabulary diversity and zero baseline bias:
*   **ISOT Dataset:** 45,000 articles (Reuters vs. Fact-Checked Fake News from 2016-2017).
*   **WELFake Dataset:** 72,000 merged articles spanning four major internet datasets.
*   **Modern News Injection:** A synthetic injection of modern 2026 vocabulary (e.g., SpaceX Mars Missions, GPT-5, Global Conflicts) to prevent the AI from throwing "Out-Of-Domain" errors on modern events.

### 2. NLP (Natural Language Processing)
*   **Regex Scrubbing:** Automatically strips scary typography and noise.
*   **Agnostic Stopwords:** Drops useless connective English words to reduce memory load.
*   **PorterStemmer:** Automatically chops suffixes off raw words (e.g., *running* -> *run*) to exponentially shrink the vocabulary matrix.
*   **TfidfVectorizer `ngram_range=(1,2)`:** Maps the 5,000 most statistically significant "N-Grams". By using Bigrams (2 words), the AI understands deep contextual phrasing (like *"not good"*) rather than just isolated words.

---

## 🚀 How to Run Locally

You must run the **Backend** and the **Frontend** inside two completely separate terminal windows.

### Terminal 1: Start the Python FastAPI Brain
Ensure that you have installed Python, then install the dependencies and launch the backend logic port.
```bash
# 1. Install required python libraries
pip install pandas scikit-learn nltk fastapi uvicorn pydantic

# 2. Launch the AI server on port 8000
uvicorn api:app --reload
```
*(You should see `Application startup complete. Uvicorn running on http://127.0.0.1:8000`)*

### Terminal 2: Start the React Frontend
Open a dedicated new terminal window and navigate into the `frontend` folder.
```bash
# 1. Enter the frontend folder
cd frontend

# 2. Install Node dependencies (only required the first time)
npm install

# 3. Launch the Vite Development Server
npm run dev
```
*(Hold `Ctrl` and click the `http://localhost:5173` link in the terminal to view the UI!)*

---

## 🧪 Testing the Model (Live Examples)
To accurately assess the efficiency and accuracy of the NLP pipeline, copy and paste the following text snippets into the React Frontend:

### ✅ 1. Real News Verification
**Copy this text:**
> *WASHINGTON (Reuters) - The U.S. Senate voted on Thursday to approve the new federal budget proposal, averting a potential government shutdown. The bipartisan bill passed with a 74-26 majority and will now head to the President's desk for final signature. Analysts expect the new infrastructure spending to create an estimated 200,000 jobs by the end of the year.*
* **Expected Result:** Recognizes formal journalistic vocabulary and outputs **Real News** with >98% Confidence.

### ❌ 2. Fake News Verification
**Copy this text:**
> *BREAKING NEWS! Our sources have just confirmed that the completely corrupt government is using the fake war situation as an excuse to cancel the 2026 elections! Leaked documents show they are planning to rule forever and force everyone to stay inside their homes. Do not trust the mainstream media, they are being paid millions to cover this up! Watch this video before they delete it!*
* **Expected Result:** Recognizes explosive, sensationalist vocabulary/formatting and outputs **Fake News** with >98% Confidence.

### ⚠️ 3. Out-of-Domain Blocking (Unrelated Text)
**Copy this text:**
> *To make the perfect chocolate chip cookies, start by preheating your oven to 350 degrees. Cream together the butter, white sugar, and brown sugar until smooth. Beat in the eggs one at a time, then stir in the vanilla. Dissolve baking soda in hot water. Stir in flour, chocolate chips, and nuts.*
* **Expected Result:** The pipeline scans for the top 5,000 statistical news words in the TF-IDF dictionary. Because less than `25` matching news words are found, the UI actively blocks the Logistic Regression model from guessing randomly and outputs **⚠️ Insufficient Data to Verify**.
