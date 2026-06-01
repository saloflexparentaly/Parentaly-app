// Utilitaires partagés frontend (App.jsx) + backend (server.js)

export function calcAge(birth) {
  if (!birth) return null;
  try {
    const b = new Date(birth);
    if (isNaN(b.getTime())) return null;
    const now = new Date();
    let mo = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
    if (now.getDate() < b.getDate()) mo--;
    if (mo < 0) return null;
    if (mo === 0) return "Nouveau-né";
    if (mo < 12) return mo + " mois";
    const y = Math.floor(mo / 12), m = mo % 12;
    return m > 0 ? `${y} ans ${m} mois` : `${y} ans`;
  } catch {
    return null;
  }
}

export function detectMultiple(children) {
  const dated = (children || []).filter(c => c.birthDate && c.firstName);
  if (dated.length < 2) return null;
  const ms = dated.map(c => new Date(c.birthDate).getTime()).filter(n => !isNaN(n));
  const groups = new Set();
  for (let i = 0; i < ms.length; i++) {
    for (let j = i + 1; j < ms.length; j++) {
      if (Math.abs(ms[i] - ms[j]) / 86400000 <= 90) { groups.add(i); groups.add(j); }
    }
  }
  if (groups.size >= 5) return "Quintuplés";
  if (groups.size === 4) return "Quadruplés";
  if (groups.size === 3) return "Triplés";
  if (groups.size === 2) return "Jumeaux";
  return null;
}
