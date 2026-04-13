import{r as m,j as e}from"./ui-CPJPuvru.js";import{X as f,S as j}from"./app-r9u0l19b.js";import{a as y}from"./html2pdf-C4QYQydl.js";import{b as s,a as x,f as a}from"./helpers-BisrqTeU.js";import{u as g}from"./useTranslation-CV_3kzxc.js";function A(){var c;const{t}=g(),{data:o,filters:p}=f().props,[b,l]=m.useState(!1);m.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&h()},[]);const h=async()=>{l(!0);const r=document.querySelector(".report-container");if(r){const n={margin:.25,filename:"account-balance-summary.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await y().set(n).from(r).save(),setTimeout(()=>window.close(),1e3)}catch(i){console.error("PDF generation failed:",i)}}l(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(j,{title:t("Account Balance Summary")}),b&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:t("Generating PDF...")})]})})}),e.jsxs("div",{className:"report-container mx-auto max-w-5xl bg-card p-8",children:[e.jsx("div",{className:"mb-8 border-b-2 border-border pb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold text-foreground",children:s("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-0.5 text-sm text-muted-foreground",children:[s("company_address")&&e.jsx("p",{children:s("company_address")}),(s("company_city")||s("company_state")||s("company_zipcode"))&&e.jsxs("p",{children:[s("company_city"),s("company_state")&&`, ${s("company_state")}`," ",s("company_zipcode")]}),s("company_country")&&e.jsx("p",{children:s("company_country")})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("h2",{className:"mb-3 text-2xl font-bold text-foreground",children:t("ACCOUNT BALANCE SUMMARY")}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[t("As of"),": ",x(p.as_of_date)]})]})]})}),(c=Object.entries(o.grouped))==null?void 0:c.map(([r,n])=>{var i;return e.jsxs("div",{className:"page-break-inside-avoid mb-6",children:[e.jsx("h3",{className:"mb-2 border-b-2 border-border pb-1 text-base font-bold",children:t(r)}),e.jsxs("table",{className:"page-break-inside-avoid mb-4 w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-black",children:[e.jsx("th",{className:"w-24 px-2 py-2 text-left text-sm font-semibold",children:t("Account Code")}),e.jsx("th",{className:"px-2 py-2 text-left text-sm font-semibold",children:t("Account Name")}),e.jsx("th",{className:"w-28 px-2 py-2 text-right text-sm font-semibold",children:t("Debit")}),e.jsx("th",{className:"w-28 px-2 py-2 text-right text-sm font-semibold",children:t("Credit")}),e.jsx("th",{className:"w-32 px-2 py-2 text-right text-sm font-semibold",children:t("Net Balance")})]})}),e.jsxs("tbody",{children:[(i=n.accounts)==null?void 0:i.map((d,u)=>e.jsxs("tr",{className:"border-b border-border",children:[e.jsx("td",{className:"px-2 py-2 text-sm",children:d.account_code}),e.jsx("td",{className:"break-words px-2 py-2 text-sm",children:d.account_name}),e.jsx("td",{className:"px-2 py-2 text-right text-sm tabular-nums",children:d.debit>0?a(d.debit):"-"}),e.jsx("td",{className:"px-2 py-2 text-right text-sm tabular-nums",children:d.credit>0?a(d.credit):"-"}),e.jsx("td",{className:"px-2 py-2 text-right text-sm font-medium tabular-nums",children:a(d.net_balance)})]},u)),e.jsxs("tr",{className:"border-t-2 border-border",children:[e.jsxs("td",{colSpan:2,className:"px-2 py-2 text-sm font-bold",children:[t("Subtotal")," - ",t(r)]}),e.jsx("td",{className:"px-2 py-2 text-right text-sm font-bold tabular-nums",children:a(n.subtotal_debit)}),e.jsx("td",{className:"px-2 py-2 text-right text-sm font-bold tabular-nums",children:a(n.subtotal_credit)}),e.jsx("td",{className:"px-2 py-2 text-right text-sm font-bold tabular-nums",children:a(n.subtotal_net)})]})]})]})]},r)}),e.jsx("table",{className:"w-full border-collapse border-t-4 border-black",children:e.jsx("tbody",{children:e.jsxs("tr",{className:"font-bold",children:[e.jsx("td",{colSpan:2,className:"px-2 py-3 text-sm",children:t("GRAND TOTAL")}),e.jsx("td",{className:"w-28 px-2 py-3 text-right text-sm tabular-nums",children:a(o.totals.debit)}),e.jsx("td",{className:"w-28 px-2 py-3 text-right text-sm tabular-nums",children:a(o.totals.credit)}),e.jsx("td",{className:"w-32 px-2 py-3 text-right text-sm tabular-nums",children:a(o.totals.net)})]})})}),e.jsx("div",{className:"mt-8 border-t pt-4 text-center text-xs text-muted-foreground",children:e.jsxs("p",{children:[t("Generated on")," ",x(new Date().toISOString())]})})]}),e.jsx("style",{children:`
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
            `})]})}export{A as default};
