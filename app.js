import {
  auth, db, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification, updateProfile,
  doc, setDoc, serverTimestamp
} from './js/firebase.js';

// Tabs
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

tabLogin?.addEventListener('click', () => {
  tabLogin.classList.add('active'); tabSignup.classList.remove('active');
  loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
});
tabSignup?.addEventListener('click', () => {
  tabSignup.classList.add('active'); tabLogin.classList.remove('active');
  signupForm.classList.remove('hidden'); loginForm.classList.add('hidden');
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      errEl.textContent = 'Please verify your email address. We re-sent a verification link.';
      await sendEmailVerification(cred.user);
      return;
    }
    window.location.href = 'dashboard.html';
  } catch (err) {
    errEl.textContent = sanitize(err.message);
  }
});

signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const displayName = document.getElementById('signup-displayName').value.trim().slice(0,50);
  const errEl = document.getElementById('signup-error');
  errEl.textContent = '';
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    // Create a user profile doc
    await setDoc(doc(db, 'users', cred.user.uid), {
      email, displayName, createdAt: serverTimestamp()
    }, { merge: true });
    alert('Account created! Check your email for a verification link.');
    window.location.href = 'index.html';
  } catch (err) {
    errEl.textContent = sanitize(err.message);
  }
});

// Redirect if already logged in (and verified)
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    // If we're on index, go to dashboard
    if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
      window.location.href = 'dashboard.html';
    }
  }
});

function sanitize(str=''){
  return String(str).replace(/[<>&]/g, (c)=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
}
