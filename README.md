# ♻️ Smart Waste Classifier

A web application that uses machine learning to classify different types of waste (plastic, paper, metal, etc.) and provide recycling tips based on the prediction.

<img src="https://img.shields.io/badge/status-active-brightgreen" alt="status badge" />

---

## 🌟 Features

- Upload an image of a waste item
- Classifies the item using a FastAI-powered ML model
- Returns category (e.g., plastic, paper) with confidence score
- Shows personalized recycling tips
- Responsive, modern UI built with React + Tailwind CSS

---

## 🧠 Tech Stack

### Frontend:
- React (Vite + TypeScript)
- Tailwind CSS
- Lucide Icons

### Backend:
- Flask (Python)
- FastAI
- CORS-enabled REST API

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/smart-waste-classifier.git
cd smart-waste-classifier
```
### 2. Set Up the Backend (Flask + FastAI)

```bash
cd backend
python -m venv fastai-env
.\fastai-env\Scripts\activate  # Use `source fastai-env/bin/activate` on macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```
### 3. Set Up the Frontend (React + Vite + Tailwind)

```bash
cd ../frontend
npm install
npm run dev
```

