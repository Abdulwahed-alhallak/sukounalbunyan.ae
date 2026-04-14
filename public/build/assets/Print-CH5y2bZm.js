import{S as h,X as b,r as l,_ as j,j as e,T as f}from"./vendor-BH9DiYmt.js";import{a as r,b as t,f as d}from"./helpers-BgvDp0PB.js";function N(){var c;const{t:a}=h(),{trialBalance:n}=b().props,[i,o]=l.useState(!1);l.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&m()},[]);const m=async()=>{o(!0);const s=document.querySelector(".trial-balance-container");if(s){const x={margin:.25,filename:`trial-balance-${r(n.from_date)}-to-${r(n.to_date)}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await j().set(x).from(s).save(),setTimeout(()=>window.close(),1e3)}catch(p){console.error("PDF generation failed:",p)}}o(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(f,{title:a("Trial Balance")}),i&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:a("Generating PDF...")})]})})}),e.jsxs("div",{className:"trial-balance-container mx-auto max-w-4xl bg-card p-12",children:[e.jsxs("div",{className:"mb-12 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-4 text-2xl font-bold",children:t("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[t("company_address")&&e.jsx("p",{children:t("company_address")}),(t("company_city")||t("company_state")||t("company_zipcode"))&&e.jsxs("p",{children:[t("company_city"),t("company_state")&&`, ${t("company_state")}`," ",t("company_zipcode")]}),t("company_country")&&e.jsx("p",{children:t("company_country")}),t("company_telephone")&&e.jsxs("p",{children:[a("Phone"),": ",t("company_telephone")]}),t("company_email")&&e.jsxs("p",{children:[a("Email"),": ",t("company_email")]})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-2 text-2xl font-bold",children:a("TRIAL BALANCE")}),e.jsx("div",{className:"space-y-1 text-sm",children:e.jsxs("p",{children:[a("Period"),": ",r(n.from_date)," - ",r(n.to_date)]})})]})]}),e.jsx("div",{className:"mb-6",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-border",children:[e.jsx("th",{className:"py-2 text-start text-sm font-bold",children:a("Account Code")}),e.jsx("th",{className:"py-2 text-start text-sm font-bold",children:a("Account Name")}),e.jsx("th",{className:"py-2 text-end text-sm font-bold",children:a("Debit")}),e.jsx("th",{className:"py-2 text-end text-sm font-bold",children:a("Credit")})]})}),e.jsx("tbody",{children:(c=n.accounts)==null?void 0:c.map(s=>e.jsxs("tr",{className:"border-b border-border",children:[e.jsx("td",{className:"py-1.5 text-sm",children:s.account_code}),e.jsx("td",{className:"py-1.5 text-sm",children:s.account_name}),e.jsx("td",{className:"py-1.5 text-end text-sm tabular-nums",children:s.debit>0?d(s.debit):"-"}),e.jsx("td",{className:"py-1.5 text-end text-sm tabular-nums",children:s.credit>0?d(s.credit):"-"})]},s.id))}),e.jsx("tfoot",{children:e.jsxs("tr",{className:"border-t-2 border-border",children:[e.jsx("td",{colSpan:2,className:"py-2 text-sm font-bold",children:a("TOTAL")}),e.jsx("td",{className:"py-2 text-end text-sm font-bold tabular-nums",children:d(n.total_debit)}),e.jsx("td",{className:"py-2 text-end text-sm font-bold tabular-nums",children:d(n.total_credit)})]})})]})}),e.jsx("div",{className:"mt-12 border-t pt-6 text-center text-sm text-muted-foreground",children:e.jsxs("p",{children:[a("Generated on")," ",r(new Date().toISOString())]})})]}),e.jsx("style",{children:`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .trial-balance-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .trial-balance-container {
                        box-shadow: none;
                    }
                }
            `})]})}export{N as default};
