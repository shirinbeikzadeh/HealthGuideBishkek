import { readFileSync, readdirSync } from 'node:fs';
const root = new URL('../src/data/', import.meta.url);
const read = file => JSON.parse(readFileSync(new URL(file, root), 'utf8'));
const errors = [];
const validUrl = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
const dateValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
function sources(record, label) { if (!Array.isArray(record.sources) || !record.sources.length) errors.push(label + ': missing sources'); else for (const source of record.sources) if (!source.label || !validUrl(source.url)) errors.push(label + ': invalid source'); }
const categories = read('categories.json'), guides = read('guides.json'), emergency = read('emergency.json');
for (const [file, records] of [['categories',categories],['guides',guides],['clinics',read('clinics.json')],['pharmacies',read('pharmacies.json')]]) {
 if (!Array.isArray(records)) { errors.push(file + ': expected array'); continue; }
 const ids = new Set();
 for (const record of records) {
  if (!record.id || ids.has(record.id)) errors.push(file + ': missing or duplicate ID'); ids.add(record.id);
  if (file === 'categories' && (!record.title || !record.description || !record.icon)) errors.push(file + ': missing field');
  if (file === 'guides') { if (!record.title || !record.summary || !Array.isArray(record.sections) || !record.sections.length || record.sections.some(s=>!s.heading || !s.text)) errors.push(file + ': missing field'); if (!categories.some(c=>c.id === record.category)) errors.push(file + ': invalid category'); sources(record,file); }
  if (file === 'clinics' || file === 'pharmacies') { if (!record.name || !record.address || record.verificationStatus !== 'verified' || !dateValid(record.lastVerified)) errors.push(file + ': missing verified listing fields'); sources(record,file); for (const key of ['website','mapUrl']) if (record[key] && !validUrl(record[key])) errors.push(file + ': invalid URL'); if (record.coordinates && (typeof record.coordinates.lat !== 'number' || typeof record.coordinates.lng !== 'number' || Math.abs(record.coordinates.lat)>90 || Math.abs(record.coordinates.lng)>180)) errors.push(file + ': invalid coordinates'); if (record.languages && (!Array.isArray(record.languages) || record.languages.some(l=>!['English','Russian','Kyrgyz','Urdu','Turkish','Other'].includes(l)))) errors.push(file + ': unsupported language'); }
 }
}
sources(emergency,'emergency'); if (!dateValid(emergency.verified) || !Array.isArray(emergency.numbers) || emergency.numbers.some(n=>!/^\d+$/.test(n.number)||!n.label)) errors.push('emergency: invalid data');
const supported = ['en','ru','ky','ur','tr']; const files = readdirSync(new URL('translations/',root)); for (const file of files) if (!supported.includes(file.replace(/\.json$/,''))) errors.push('unsupported translation: '+file); for (const lang of supported) { const dictionary=read('translations/'+lang+'.json'); if (!dictionary || typeof dictionary !== 'object' || Array.isArray(dictionary) || Object.values(dictionary).some(v=>typeof v!=='string')) errors.push('invalid dictionary: '+lang); }
if (errors.length) { console.error(errors.join('\n')); process.exit(1); } console.log('Content validation passed.');
