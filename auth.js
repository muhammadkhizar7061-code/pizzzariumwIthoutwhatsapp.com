const PIZZARIUM_SUPABASE_URL = 'https://avtiuwvvkyzglvkrqpyg.supabase.co';
const PIZZARIUM_PUBLISHABLE_KEY = 'sb_publishable_AemE6eA9-KykfslVujMv9A_lAqo3UKn';
const sessionKey = 'pizzarium-auth-session';

function getSession() { try { return JSON.parse(localStorage.getItem(sessionKey)); } catch { return null; } }
function saveSession(session) { localStorage.setItem(sessionKey, JSON.stringify(session)); }
function clearSession() { localStorage.removeItem(sessionKey); }
async function authRequest(path, body) { const response = await fetch(`${PIZZARIUM_SUPABASE_URL}${path}`, { method: 'POST', headers: { apikey: PIZZARIUM_PUBLISHABLE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const result = await response.json(); if (!response.ok) throw new Error(result.msg || result.message || result.error_description || 'Unable to complete your request.'); return result; }
async function signUp({ name, phone, email, password }) { const result = await authRequest('/auth/v1/signup', { email, password, data: { full_name: name, phone } }); if (result.access_token) saveSession(result); return result; }
async function signIn({ email, password }) { const result = await authRequest('/auth/v1/token?grant_type=password', { email, password }); saveSession(result); return result; }
function signOut() { clearSession(); window.location.href = 'index.html'; }
function updateHeaderAccount() { const header = document.querySelector('.header'); if (!header || header.querySelector('.auth-links')) return; const session = getSession(), links = document.createElement('div'); links.className = 'auth-links'; if (session) { const signOutLink = document.createElement('a'); signOutLink.className = 'auth-link'; signOutLink.href = '#'; signOutLink.textContent = 'Sign out'; signOutLink.addEventListener('click', event => { event.preventDefault(); signOut(); }); links.append(signOutLink); } else { links.innerHTML = '<a class="auth-link" href="sign-in.html">Sign in</a><a class="auth-link auth-signup" href="sign-up.html">Sign up</a>'; } const menu = header.querySelector('.menu-toggle'); if (menu) header.insertBefore(links, menu); else header.append(links); }
window.PizzariumAuth = { getSession, signUp, signIn, signOut, updateHeaderAccount, url: PIZZARIUM_SUPABASE_URL, key: PIZZARIUM_PUBLISHABLE_KEY };
document.addEventListener('DOMContentLoaded', updateHeaderAccount);
