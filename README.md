# AI Skills — Firebase Auth + Firestore Starter

A beautiful, beginner-friendly site with **Email/Password signup/login**, logout, password reset, and a protected dashboard.  
The dashboard provides a **step-by-step AI learning curriculum** (preloaded into Firestore for each user).

---

## 1) Pages & Flow

- `index.html` – Landing page with **Log in / Sign up** links  
- `login.html` – Login form  
- `signup.html` – Signup form (with email verification)  
- `reset.html` – Password reset (via email link)  
- `dashboard.html` – Protected dashboard showing **AI courses & progress tracker**  

Users must verify their email before they can access the dashboard.

---

## 2) Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
2. Enable:
   - **Authentication → Sign-in method → Email/Password**
   - **Firestore Database** (start in production mode)
3. Add a **Web App** and copy its config into `js/firebase.js`.
4. In Firestore → **Rules**, paste and publish `firestore.rules`.

---

## 3) Security

- Firestore rules restrict data to each authenticated user (`users/{uid}` and their `courses` subcollection).
- Email verification is required.
- Firebase web config is **not secret**, but restrict your API key in Google Cloud Console → Credentials (add your GitHub Pages domain as an allowed referrer).
- Consider enabling **App Check** for extra protection.

---

## 4) GitHub Pages Deployment

1. Push this repo to GitHub.
2. In GitHub → Settings → Pages:
   - Source: **Deploy from branch**
   - Branch: `main` (or `master`)
   - Folder: `/root`  
3. Wait a few minutes, then visit `https://<username>.github.io/<repo>/`.

---

## 5) AI Curriculum (Preloaded Courses)

When a new user signs up, their dashboard will automatically load these beginner AI tracks:

1. **AI Foundations**
   - What is AI vs. ML vs. DL  
   - Data, features, and labels  
   - Training vs. inference  
   - Ethics & responsible AI basics  

2. **Python for AI (Crash)**
   - Python syntax & notebooks  
   - NumPy arrays & pandas dataframes  
   - Matplotlib plotting essentials  
   - Working with datasets  

3. **Machine Learning Basics**
   - Supervised vs. unsupervised learning  
   - Train/test splits & validation  
   - Linear models & k-NN  
   - Overfitting and regularization  

4. **Neural Networks Lite**
   - Perceptrons & activation functions  
   - Layers, parameters, and backprop (intuitively)  
   - Intro to Keras/PyTorch workflows  
   - Image classification mini-project  

5. **Prompting & LLM Basics**
   - Prompt patterns & structure  
   - Safety & bias awareness  
   - Evaluation & iteration  
   - Build a simple chatbot (low-code)  

Each course is stored under the user’s document in Firestore and progress is tracked with a slider.

---

## 6) Local Development

Run a static server locally (e.g., VS Code Live Server) and open `index.html`.

---
