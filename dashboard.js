import {
  auth, db, onAuthStateChanged, signOut,
  doc, setDoc, getDoc, collection, getDocs, query, where, serverTimestamp
} from './js/firebase.js';

const logoutBtn = document.getElementById('logout');
const displayNameEl = document.getElementById('displayName');
const userPill = document.getElementById('user-pill');
const coursesGrid = document.getElementById('courses');
const generateBtn = document.getElementById('generate');
const refreshBtn = document.getElementById('refresh');

onAuthStateChanged(auth, async (user) => {
  if (!user || !user.emailVerified) {
    location.href = 'index.html';
    return;
  }
  displayNameEl.textContent = user.displayName || 'Student';
  userPill.textContent = user.email;

  await ensureUserDoc(user);
  await renderCourses(user);
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  location.href = 'index.html';
});

generateBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return;
  const seedCourses = generateBeginnerCourses();
  await Promise.all(seedCourses.map(c => saveCourse(user.uid, c)));
  await renderCourses(user);
});

refreshBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) return;
  await renderCourses(user);
});

async function ensureUserDoc(user){
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { email: user.email, displayName: user.displayName || '', createdAt: serverTimestamp() }, { merge: true });
  }
}

async function saveCourse(uid, course){
  const id = course.id;
  const ref = doc(db, `users/${uid}/courses/${id}`);
  await setDoc(ref, { ...course, updatedAt: serverTimestamp() }, { merge: true });
}

async function renderCourses(user){
  coursesGrid.innerHTML = '<p class="muted">Loading…</p>';
  const q = collection(db, `users/${user.uid}/courses`);
  const snaps = await getDocs(q);
  const items = [];
  snaps.forEach(doc => items.push(doc.data()));
  if (!items.length) {
    coursesGrid.innerHTML = `<div class="card"><p>No courses yet. Click <strong>Generate starter course list</strong> to begin.</p></div>`;
    return;
  }
  coursesGrid.innerHTML = items.map(renderCourseCard).join('');
  bindProgressHandlers(user.uid);
}

function renderCourseCard(c){
  return `<div class="card course" data-id="${c.id}">
    <div class="badge">${escapeHTML(c.level)}</div>
    <h3>${escapeHTML(c.title)}</h3>
    <div class="meta">${escapeHTML(c.description)}</div>
    <ul>${c.modules.map(m => `<li>• ${escapeHTML(m)}</li>`).join('')}</ul>
    <label>Progress
      <div class="progress"><span style="width:${c.progress||0}%"></span></div>
    </label>
    <input type="range" min="0" max="100" value="${c.progress||0}" data-role="progress">
  </div>`;
}

function bindProgressHandlers(uid){
  document.querySelectorAll('[data-role="progress"]').forEach(input => {
    input.addEventListener('input', async (e)=>{
      const id = e.target.closest('.course').dataset.id;
      const value = Number(e.target.value);
      const ref = doc(db, `users/${uid}/courses/${id}`);
      await setDoc(ref, { progress: value, updatedAt: serverTimestamp() }, { merge: true });
      e.target.previousElementSibling.querySelector('span').style.width = value + '%';
    });
  });
}

function generateBeginnerCourses(){
  // Deterministic local generation (no server, no API keys)
  const catalog = [
    {
      id:'ai-101',
      title:'AI Foundations',
      level:'Beginner',
      description:'Understand what AI is, common terms, and realistic capabilities.',
      modules:[
        'What is AI vs. ML vs. DL',
        'Data, features, and labels',
        'Training vs. inference',
        'Ethics & responsible AI basics'
      ],
      progress:0
    },
    {
      id:'py-ml-101',
      title:'Python for AI (Crash)',
      level:'Beginner',
      description:'Hands-on Python essentials for data and AI work.',
      modules:[
        'Python syntax & notebooks',
        'NumPy arrays & pandas dataframes',
        'Matplotlib plotting essentials',
        'Working with datasets'
      ],
      progress:0
    },
    {
      id:'ml-101',
      title:'Machine Learning Basics',
      level:'Beginner',
      description:'Core ML ideas with simple projects.',
      modules:[
        'Supervised vs. unsupervised',
        'Train/test splits & validation',
        'Linear models & k-NN',
        'Overfitting and regularization'
      ],
      progress:0
    },
    {
      id:'nn-101',
      title:'Neural Networks Lite',
      level:'Beginner',
      description:'A gentle intro to neural networks and deep learning.',
      modules:[
        'Perceptrons & activation functions',
        'Layers, parameters, and backprop (intuitively)',
        'Intro to Keras/PyTorch workflows',
        'Image classification mini-project'
      ],
      progress:0
    },
    {
      id:'prompt-101',
      title:'Prompting & LLM Basics',
      level:'Beginner',
      description:'Work safely and effectively with large language models.',
      modules:[
        'Prompt patterns & structure',
        'Safety & bias awareness',
        'Evaluation & iteration',
        'Build a simple LLM-powered chatbot (no-code/low-code)'
      ],
      progress:0
    }
  ];
  return catalog;
}

function escapeHTML(str=''){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

export async function saveStarterCourses(uid){
  const seedCourses = generateBeginnerCourses();
  for (const c of seedCourses){
    const ref = doc(db, `users/${uid}/courses/${c.id}`);
    await setDoc(ref, { ...c, updatedAt: serverTimestamp() }, { merge: true });
  }
}
