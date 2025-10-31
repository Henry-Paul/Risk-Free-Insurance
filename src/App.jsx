import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { INDIAN_COMPANIES, POLICIES, COMPARISON_DATA } from './components/RiskComponents';
import ContactPage from './pages/Contact';

function formatCurrency(n){ return !n ? '—' : '₹' + Number(n).toLocaleString('en-IN'); }

export default function App(){
  // EmailJS init
  const PUBLIC = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  useEffect(()=>{ if(PUBLIC) try{ emailjs.init(PUBLIC); } catch(e){ console.warn(e); } }, []);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recommended');
  const [companyModal, setCompanyModal] = useState(null);
  const [planModal, setPlanModal] = useState(null);
  const [leadModal, setLeadModal] = useState(false);
  const [leadStatus, setLeadStatus] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);

  // Quick helpers
  function openCompany(id){ setCompanyModal(id); }
  function closeCompany(){ setCompanyModal(null); }
  function openPlan(cid,pid){ setPlanModal({cid,pid}); closeCompany(); }
  function closePlan(){ setPlanModal(null); }

  // Lead send via EmailJS
  async function sendLead(formData){
    setLeadLoading(true);
    setLeadStatus('');
    const payload = {...formData, source:'Website - Quick Quote'};
    try {
      if (SERVICE && TEMPLATE) {
        await emailjs.send(SERVICE, TEMPLATE, payload);
        setLeadStatus('Thanks — your request was sent.');
      } else {
        setLeadStatus('Demo: set VITE_EMAILJS_* env vars to enable sending.');
        console.info('Lead payload:', payload);
      }
    } catch(err){
      console.error(err);
      setLeadStatus('Failed to send. Try again or call us.');
    } finally {
      setLeadLoading(false);
    }
  }

  function handleLeadSubmit(e){
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = Object.fromEntries(fd.entries());
    sendLead(obj);
    // keep modal open to show status
  }

  // Rendered lists filtered
  const filteredCompanies = INDIAN_COMPANIES.filter(c=>{
    if (category && c.category !== category) return false;
    if (search && !((c.name||'').toLowerCase().includes(search.toLowerCase()) || (c.features||[]).join(' ').toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  // Comparison sorted
  let comparisons = [...COMPARISON_DATA];
  if(sort === 'price-asc') comparisons.sort((a,b)=> parseInt(a.priceFmt.replace(/\D/g,'')) - parseInt(b.priceFmt.replace(/\D/g,'')));
  if(sort === 'price-desc') comparisons.sort((a,b)=> parseInt(b.priceFmt.replace(/\D/g,'')) - parseInt(a.priceFmt.replace(/\D/g,'')));
  if(sort === 'claim-desc') comparisons.sort((a,b)=> parseFloat(b.claimRatio) - parseFloat(a.claimRatio));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-50 flex items-center justify-center text-blue-600 font-bold">RW</div>
            <div className="font-extrabold">RiskWise India</div>
          </div>
          <div className="hidden sm:flex gap-3 items-center">
            <a href="#contact" className="text-sm text-gray-600">Contact</a>
            <button onClick={()=>document.getElementById('faq')?.scrollIntoView({behavior:'smooth'})} className="btn-primary text-sm">FAQ & Support</button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-12 text-center">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="hero-h1 sm:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">Compare <span className="text-blue-600">Top Indian Insurers</span> Quickly — Chat or Call Instantly</h1>
            <p className="text-gray-600 mt-2">Scan claim ratios, compare indicative prices, and connect with advisors instantly.</p>

            <div className="mt-4 flex items-center gap-3 justify-center">
              <button onClick={()=>setLeadModal(true)} className="btn-primary px-5 py-3">Contact Us — Quick Quote</button>
              <a className="btn-phone px-4 py-3" href="tel:+919876543210">Call Now</a>
              <a className="btn-whatsapp px-4 py-3" href="https://wa.me/919876543210" target="_blank">Chat</a>
            </div>

            <div className="mt-6 flex gap-2 justify-center">
              <input value={search} onChange={e=>setSearch(e.target.value)} className="rounded border px-3 py-2 w-80" placeholder="Search providers or plans" />
              <select value={category} onChange={e=>setCategory(e.target.value)} className="rounded border px-3 py-2">
                <option value="">All Categories</option>
                <option value="Health">Health</option>
                <option value="Life">Life</option>
                <option value="General">General</option>
              </select>
              <select value={sort} onChange={e=>setSort(e.target.value)} className="rounded border px-3 py-2">
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="claim-desc">Claim Ratio: High → Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Marketing banner */}
        <section className="max-w-7xl mx-auto px-4 mt-6">
          <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Why People Choose RiskWise</h3>
              <p className="text-gray-700 mt-2">We simplify policy comparisons, highlight claim performance, and connect you with advisors instantly.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setLeadModal(true)} className="btn-primary">Get Free Quote</button>
              <a href="/contact" className="text-sm text-gray-600 self-center">Full contact form →</a>
            </div>
          </div>
        </section>

        {/* Company Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Handpicked Providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCompanies.map(c => (
                <article key={c.id} className="card p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.category}</div>
                      <ul className="text-sm text-gray-600 mt-2">
                        {c.features.slice(0,3).map((f,i)=><li key={i} className="flex items-start">{/* check svg */} {f}</li>)}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={()=>openCompany(c.id)} className="btn-primary">View Plans</button>
                      <button className="text-xs text-gray-500">Save</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials (Fear vs Reality) */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h3 className="text-2xl font-bold text-center mb-4">Real concerns, real outcomes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="text-sm text-red-600 font-semibold">Fear: "Claims get rejected."</div>
              <div className="text-green-800 font-bold mt-2">Reality: "Found a plan with 95% claim ratio — claim settled in 10 days." — S. Mehra</div>
              <div className="mt-3 text-right"><button onClick={()=>openPlan('star',101)} className="btn-primary text-sm">Get Quote</button></div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-red-600 font-semibold">Fear: "Term insurance is expensive."</div>
              <div className="text-green-800 font-bold mt-2">Reality: "ICICI's plan was affordable and strong." — R. Kapoor</div>
              <div className="mt-3 text-right"><button onClick={()=>openPlan('icici',201)} className="btn-primary text-sm">Get Quote</button></div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-red-600 font-semibold">Fear: "Hidden exclusions."</div>
              <div className="text-green-800 font-bold mt-2">Reality: "RiskWise showed exclusions up front." — A. Sharma</div>
              <div className="mt-3 text-right"><button onClick={()=>openPlan('hdfc',301)} className="btn-primary text-sm">Get Quote</button></div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-red-600 font-semibold">Fear: "Process will be long."</div>
              <div className="text-green-800 font-bold mt-2">Reality: "One chat and advisor guided me through purchase." — P. Desai</div>
              <div className="mt-3 text-right"><button onClick={()=>openPlan('max',401)} className="btn-primary text-sm">Get Quote</button></div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-xl font-bold mb-4">Direct Plan Comparison</h3>
            <div className="overflow-x-auto rounded shadow">
              <table className="min-w-full text-left">
                <thead className="bg-blue-50 text-xs text-blue-700">
                  <tr>
                    <th className="px-3 py-3">Plan</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Sum Insured</th>
                    <th className="px-3 py-3">Claim Ratio</th>
                    <th className="px-3 py-3">Indicative Price</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-3">{r.name}</td>
                      <td className="px-3 py-3">{r.type}</td>
                      <td className="px-3 py-3">{r.sumInsured}</td>
                      <td className="px-3 py-3 text-green-600">{r.claimRatio}</td>
                      <td className="px-3 py-3 text-blue-600">{r.priceFmt}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button onClick={()=>openPlan(r.companyId, r.planId)} className="bg-blue-600 text-white px-2 py-1 rounded">Details</button>
                          <button onClick={()=>navigator.clipboard?.writeText(`${location.href}#ref=${r.planId}`)} className="text-blue-600 underline">Copy Link</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-10 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div className="card p-4">
                <div className="font-semibold">What is NCB?</div>
                <div className="text-sm text-gray-600 mt-2">No Claim Bonus is a reward for not claiming during the policy year.</div>
              </div>
              <div className="card p-4">
                <div className="font-semibold">Cashless vs Reimbursement?</div>
                <div className="text-sm text-gray-600 mt-2">Cashless at network hospitals vs reimbursement for non-network.</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">© {new Date().getFullYear()} RiskWise India — Illustrative data only.</div>
        </footer>
      </main>

      {/* Floating CTAs */}
      <a className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center text-white" style={{background:'#25D366'}} href="https://wa.me/919876543210" target="_blank" rel="noreferrer">WA</a>
      <a className="fixed right-4 bottom-8 w-14 h-14 rounded-full flex items-center justify-center text-white" style={{background:'#f7921e'}} href="tel:+919876543210">Call</a>

      {/* Company Modal */}
      {companyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 overflow-auto max-h-[85vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">{INDIAN_COMPANIES.find(c=>c.id===companyModal)?.name}</h3>
              </div>
              <div>
                <button onClick={closeCompany} className="text-gray-500">Close</button>
              </div>
            </div>
            <div className="space-y-4">
              {(POLICIES[companyModal]||[]).map(p => (
                <div key={p.id} className="card p-4 flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.type} • {p.details?.sumInsured}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-green-600">{formatCurrency(p.finalPrice)}</div>
                    <div className="mt-2 flex gap-2 justify-end">
                      <button onClick={()=>openPlan(companyModal,p.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded">View Full Details</button>
                      <a className="btn-whatsapp inline-flex items-center gap-2 px-3 py-1.5" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">Chat Now</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {planModal && (()=> {
        const p = (POLICIES[planModal.cid]||[]).find(x=>x.id===planModal.pid);
        if(!p) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 overflow-auto max-h-[85vh]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <button onClick={()=>{ closePlan(); setCompanyModal(planModal.cid); }} className="text-blue-600 mr-3">← Back</button>
                  <h3 className="text-2xl font-bold inline">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.type} • {p.details?.sumInsured}</p>
                </div>
                <div><button onClick={closePlan} className="text-gray-500">Close</button></div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-semibold">Annual Premium</div>
                  <div className="text-2xl font-extrabold text-green-600">{formatCurrency(p.finalPrice)}</div>
                  <div className="text-sm text-gray-700 mt-2">{(p.details?.features||[]).join(', ')}</div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Key Inclusions</h4>
                    <ul className="list-disc list-inside mt-2 text-sm text-gray-700">{(p.details?.features||[]).map((f,i)=><li key={i}>{f}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Important Exclusions</h4>
                    <ul className="list-disc list-inside mt-2 text-sm text-gray-700">{(p.details?.exclusions?.length ? p.details.exclusions : ['Refer to insurer documentation']).map((e,i)=><li key={i}>{e}</li>)}</ul>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={()=>{ navigator.clipboard?.writeText(`${location.href}#ref=${p.id}`); alert('Referral link copied'); }} className="px-3 py-1.5 border rounded">Copy Referral Link</button>
                  <button onClick={()=>{ setLeadModal(true); document.getElementById('lead-plan')?.setAttribute('value', p.name); }} className="btn-primary">Request Quote</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Lead Modal */}
      {leadModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center modal-backdrop p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-bold">Quick Quote — Contact Advisor</h4>
              <button onClick={()=>setLeadModal(false)} className="text-gray-500">Close</button>
            </div>

            <form id="lead-form" onSubmit={(e)=>{ e.preventDefault(); const fd = new FormData(e.target); const obj = Object.fromEntries(fd.entries()); sendLead(obj); }} className="space-y-3">
              <input name="user_name" placeholder="Full name" required className="w-full px-3 py-2 rounded border" />
              <input name="user_phone" placeholder="Mobile (e.g. +91...)" required className="w-full px-3 py-2 rounded border" />
              <input name="user_email" placeholder="Email" className="w-full px-3 py-2 rounded border" />
              <input id="lead-plan" name="plan" placeholder="Plan (optional)" className="w-full px-3 py-2 rounded border" />
              <textarea name="message" placeholder="Short note" className="w-full px-3 py-2 rounded border" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">We will contact you during business hours.</div>
                <button type="submit" className="btn-primary">{leadLoading ? 'Sending...' : 'Request Quote'}</button>
              </div>
              {leadStatus && <div className="text-sm mt-2">{leadStatus}</div>}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
