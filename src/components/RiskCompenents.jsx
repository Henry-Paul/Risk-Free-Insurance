import React from 'react';
import { Check } from 'lucide-react';

export const INDIAN_COMPANIES = [
  {id:'star', name:'Star Health Insurance', features:['9000+ Cashless Hospitals','No Co-Pay on Select Plans','Specialist Health Focus'], category:'Health'},
  {id:'icici', name:'ICICI Prudential Life', features:['High Claim Settlement (98.5%)','Customizable Payouts','Term Life Experts'], category:'Life'},
  {id:'hdfc', name:'HDFC ERGO', features:['Secure Benefit (2X Coverage)','Digital Claim Process','General & Health'], category:'General'},
  {id:'max', name:'Max Life Insurance', features:['Guaranteed Return Options','Accident & Disability Riders','High Tenure Term Plans'], category:'Life'}
];

export const POLICIES = {
  star: [{id:101,name:'Family Health Optima', type:'Family Floater', finalPrice:12750, referralBonus:'₹1,000 Amazon Voucher', ctaType:'WhatsApp', details:{sumInsured:'₹5 Lakhs', features:['Automatic Restoration of SI','Maternity Cover (Optional)'], exclusions:['First 30 days non-accident claims']}}],
  icici: [{id:201,name:'iProtect Smart', type:'Term Life', finalPrice:16200, referralBonus:'None', ctaType:'Phone', details:{sumInsured:'₹1 Cr', features:['Term cover','Optional Critical Illness'], exclusions:[]}}],
  hdfc: [{id:301,name:'Optima Secure', type:'Health', finalPrice:18700, referralBonus:'None', ctaType:'WhatsApp', details:{sumInsured:'₹10 Lakhs', features:['2X Coverage','Digital Claims'], exclusions:[]}}],
  max: [{id:401,name:'Smart Secure', type:'Term Life', finalPrice:24000, referralBonus:'None', ctaType:'Phone', details:{sumInsured:'₹2 Cr', features:['ROP Option','Accident Add-on'], exclusions:[]}}]
};

export const COMPARISON_DATA = [
  { name:'Star Family Health Optima', type:'Health', sumInsured:'₹5 L', claimRatio:'95%', priceFmt:'₹12,750/yr', companyId:'star', planId:101 },
  { name:'HDFC Ergo Optima Secure', type:'Health', sumInsured:'₹10 L', claimRatio:'98%', priceFmt:'₹18,700/yr', companyId:'hdfc', planId:301 },
  { name:'ICICI Pru iProtect Smart', type:'Term Life', sumInsured:'₹1 Cr', claimRatio:'98.5%', priceFmt:'₹16,200/yr', companyId:'icici', planId:201 },
  { name:'Max Life Smart Secure', type:'Term Life', sumInsured:'₹2 Cr', claimRatio:'99.2%', priceFmt:'₹24,000/yr', companyId:'max', planId:401 }
];

export function IconCheck(props){ return <Check className="w-4 h-4 inline mr-2" {...props} />; }
