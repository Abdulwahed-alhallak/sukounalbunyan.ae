import{S as u,X as j,r as i,_ as f,j as e,T as y}from"./vendor-BH9DiYmt.js";import{a as r,b as t,f as l}from"./helpers-BgvDp0PB.js";function _(){const{t:s}=u(),{entries:c,selectedAccount:o,filters:n}=j().props,[m,d]=i.useState(!1);i.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&x()},[]);const x=async()=>{d(!0);const a=document.querySelector(".ledger-summary-container");if(a){const p={margin:.25,filename:`ledger-summary-${r(n.from_date||new Date().toISOString())}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await f().set(p).from(a).save(),setTimeout(()=>window.close(),1e3)}catch(h){console.error("PDF generation failed:",h)}}d(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(y,{title:s("Ledger Summary")}),m&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:s("Generating PDF...")})]})})}),e.jsxs("div",{className:"ledger-summary-container mx-auto max-w-4xl bg-card p-12",children:[e.jsxs("div",{className:"mb-12 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-4 text-2xl font-bold",children:t("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[t("company_address")&&e.jsx("p",{children:t("company_address")}),(t("company_city")||t("company_state")||t("company_zipcode"))&&e.jsxs("p",{children:[t("company_city"),t("company_state")&&`, ${t("company_state")}`," ",t("company_zipcode")]}),t("company_country")&&e.jsx("p",{children:t("company_country")}),t("company_telephone")&&e.jsxs("p",{children:[s("Phone"),": ",t("company_telephone")]}),t("company_email")&&e.jsxs("p",{children:[s("Email"),": ",t("company_email")]})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-2 text-2xl font-bold",children:s("LEDGER SUMMARY")}),e.jsxs("div",{className:"space-y-1 text-sm",children:[n.from_date&&n.to_date&&e.jsxs("p",{children:[s("Period"),": ",r(n.from_date)," - ",r(n.to_date)]}),o&&e.jsxs("p",{children:[s("Account"),": ",o.account_code," - ",o.account_name]})]})]})]}),e.jsx("div",{className:"mb-6",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-border",children:[e.jsx("th",{className:"py-2 text-start text-sm font-bold",children:s("Date")}),e.jsx("th",{className:"py-2 text-start text-sm font-bold",children:s("Account")}),e.jsx("th",{className:"py-2 text-start text-sm font-bold",children:s("Description")}),e.jsx("th",{className:"py-2 text-end text-sm font-bold",children:s("Debit")}),e.jsx("th",{className:"py-2 text-end text-sm font-bold",children:s("Credit")})]})}),e.jsx("tbody",{children:c==null?void 0:c.map(a=>e.jsxs("tr",{className:"border-b border-border",children:[e.jsx("td",{className:"py-1.5 text-sm",children:r(a.journal_date)}),e.jsx("td",{className:"py-1.5 text-sm",children:a.account_code}),e.jsx("td",{className:"py-1.5 text-sm",children:a.description||a.journal_description}),e.jsx("td",{className:"py-1.5 text-end text-sm tabular-nums",children:a.debit_amount>0?l(a.debit_amount):"-"}),e.jsx("td",{className:"py-1.5 text-end text-sm tabular-nums",children:a.credit_amount>0?l(a.credit_amount):"-"})]},a.id))})]})}),e.jsxs("div",{className:"mt-12 border-t pt-6 text-center text-sm text-muted-foreground",children:[e.jsx("p",{children:t("company_name")}),e.jsxs("p",{children:[s("Generated on")," ",r(new Date().toISOString())]})]})]}),e.jsx("style",{children:`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .ledger-summary-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .ledger-summary-container {
                        box-shadow: none;
                    }
                }
            `})]})}export{_ as default};
