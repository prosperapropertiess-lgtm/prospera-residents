export const costItems = [
  {key:"rent",label:"Base rent",hint:"The advertised or agreed monthly rent."},
  {key:"electricity",label:"Electricity",hint:"Enter 0 only if included or not applicable."},
  {key:"heating",label:"Heating / gas",hint:"Avoid counting it twice if covered by electricity."},
  {key:"water",label:"Water",hint:"Confirm any shared-bill arrangement."},
  {key:"parking",label:"Parking",hint:"Include extra space or permit charges."},
  {key:"laundry",label:"Laundry",hint:"Your monthly use if charged separately."},
  {key:"internet",label:"Internet",hint:"Your plan or the home’s arrangement."},
  {key:"insurance",label:"Tenant insurance",hint:"Use your own quote."},
  {key:"transport",label:"Transport",hint:"Optional comparison cost; enter 0 to exclude."},
  {key:"other",label:"Other recurring costs",hint:"Include anything specific to this home."},
] as const;
export type CostKey=typeof costItems[number]["key"];
export type Cost={amount:string;basis:"known"|"estimate";note:string};
export type Worksheet=Record<CostKey,Cost>;
export function emptyWorksheet(rent=""):Worksheet{return Object.fromEntries(costItems.map(x=>[x.key,{amount:x.key==="rent"?rent:"",basis:x.key==="rent"?"known":"estimate",note:""}])) as Worksheet;}
export function worksheetTotals(sheet:Worksheet){let known=0,estimated=0,unknown=0;for(const {key} of costItems){const c=sheet[key];const n=Number(c.amount);if(!c.amount.trim()||!Number.isFinite(n)||n<0||n>1000000){unknown++;continue;}if(c.basis==="known")known+=n;else estimated+=n;}return {known,estimated,unknown,total:known+estimated};}
export const checklists={
  viewing:["Confirm that the home is available for your move window.","Agree the time, meeting point and responsible contact.","Confirm rent, utility arrangements and extra charges.","Check parking, laundry, storage and shared spaces.","Ask about the specific stairs or access features you need.","Ask how heating, cooling and waste collection work.","Record questions, observed issues and promised follow-up.","Confirm who manages the home after move-in."],
  moving:["Confirm your key handover time and contact.","Arrange the utilities and services you are responsible for.","Check building access, moving rules and elevator bookings.","Keep your agreement and important contacts handy.","Pack a first-night essentials bag.","Record the home’s condition and report existing issues.","Check keys and learn how appliances and heating work.","Find the maintenance and emergency instructions.","Update the addresses and accounts that matter to you.","Follow up on any unresolved move-in issues."],
};
