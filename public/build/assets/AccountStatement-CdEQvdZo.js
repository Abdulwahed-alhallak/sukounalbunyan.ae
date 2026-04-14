import{S as j,X as y,r as x,_ as N,j as e,T as g}from"./vendor-BH9DiYmt.js";import{b as a,a as l,f as r}from"./helpers-BgvDp0PB.js";function v(){var m;const{t:s}=j(),{data:n,selectedAccount:d,filters:c}=y().props,[p,i]=x.useState(!1),b=n.transactions.reduce((t,o)=>t+o.debit,0),h=n.transactions.reduce((t,o)=>t+o.credit,0);x.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&f()},[]);const f=async()=>{i(!0);const t=document.querySelector(".report-container");if(t){const o={margin:.25,filename:`account-statement-${(d==null?void 0:d.account_code)||"report"}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await N().set(o).from(t).save(),setTimeout(()=>window.close(),1e3)}catch(u){console.error("PDF generation failed:",u)}}i(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(g,{title:s("Account Statement")}),p&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:s("Generating PDF...")})]})})}),e.jsxs("div",{className:"report-container mx-auto max-w-5xl bg-card p-8",children:[e.jsx("div",{className:"mb-8 border-b-2 border-border pb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold text-foreground",children:a("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-0.5 text-sm text-muted-foreground",children:[a("company_address")&&e.jsx("p",{children:a("company_address")}),(a("company_city")||a("company_state")||a("company_zipcode"))&&e.jsxs("p",{children:[a("company_city"),a("company_state")&&`, ${a("company_state")}`," ",a("company_zipcode")]}),a("company_country")&&e.jsx("p",{children:a("company_country")})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-3 text-2xl font-bold text-foreground",children:s("ACCOUNT STATEMENT")}),d&&e.jsxs("div",{className:"space-y-1 text-sm text-foreground",children:[e.jsxs("p",{className:"text-base font-semibold",children:[d.account_code," - ",d.account_name]}),c.from_date&&c.to_date&&e.jsxs("p",{className:"text-muted-foreground",children:[l(c.from_date)," ",s("to")," ",l(c.to_date)]})]})]})]})}),e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-black",children:[e.jsx("th",{className:"w-24 px-3 py-2 text-start text-sm font-semibold",children:s("Date")}),e.jsx("th",{className:"px-3 py-2 text-start text-sm font-semibold",children:s("Description")}),e.jsx("th",{className:"w-28 px-3 py-2 text-start text-sm font-semibold",children:s("Reference")}),e.jsx("th",{className:"w-24 px-3 py-2 text-end text-sm font-semibold",children:s("Debit")}),e.jsx("th",{className:"w-24 px-3 py-2 text-end text-sm font-semibold",children:s("Credit")}),e.jsx("th",{className:"w-28 px-3 py-2 text-end text-sm font-semibold",children:s("Balance")})]})}),e.jsxs("tbody",{children:[n.opening_balance!==0&&e.jsxs("tr",{className:"border-b border-border",children:[e.jsx("td",{colSpan:5,className:"px-3 py-2 text-sm font-semibold",children:s("Opening Balance")}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-semibold tabular-nums",children:r(n.opening_balance)})]}),(m=n.transactions)==null?void 0:m.map(t=>e.jsxs("tr",{className:"page-break-inside-avoid border-b border-border",children:[e.jsx("td",{className:"whitespace-nowrap px-3 py-2 text-sm",children:l(t.date)}),e.jsx("td",{className:"break-words px-3 py-2 text-sm",children:t.description}),e.jsx("td",{className:"px-3 py-2 text-sm",children:t.reference_type}),e.jsx("td",{className:"px-3 py-2 text-end text-sm tabular-nums",children:t.debit>0?r(t.debit):"-"}),e.jsx("td",{className:"px-3 py-2 text-end text-sm tabular-nums",children:t.credit>0?r(t.credit):"-"}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-medium tabular-nums",children:r(t.balance)})]},t.id)),e.jsxs("tr",{className:"border-t-2 border-border",children:[e.jsx("td",{colSpan:3,className:"px-3 py-2 text-sm font-bold",children:s("Total")}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-bold tabular-nums",children:r(b)}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-bold tabular-nums",children:r(h)}),e.jsx("td",{className:"px-3 py-2 text-sm"})]}),e.jsxs("tr",{className:"border-t-2 border-black",children:[e.jsx("td",{colSpan:5,className:"px-3 py-2 text-sm font-bold",children:s("Closing Balance")}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-bold tabular-nums",children:r(n.closing_balance)})]})]})]}),e.jsx("div",{className:"mt-8 border-t pt-4 text-center text-xs text-muted-foreground",children:e.jsxs("p",{children:[s("Generated on")," ",l(new Date().toISOString())]})})]}),e.jsx("style",{children:`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .report-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                .page-break-inside-avoid {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .report-container {
                        box-shadow: none;
                    }

                    .page-break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `})]})}export{v as default};
