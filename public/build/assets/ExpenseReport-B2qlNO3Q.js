import{S as f,X as u,r as l,_ as j,j as e,T as y}from"./vendor-BH9DiYmt.js";import{b as t,a as o,f as m}from"./helpers-BgvDp0PB.js";function w(){var i;const{t:s}=f(),{data:r,filters:d}=u().props,[x,c]=l.useState(!1),p=a=>r.total_expenses===0?0:(a/r.total_expenses*100).toFixed(1);l.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&b()},[]);const b=async()=>{c(!0);const a=document.querySelector(".report-container");if(a){const n={margin:.25,filename:"expense-report.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await j().set(n).from(a).save(),setTimeout(()=>window.close(),1e3)}catch(h){console.error("PDF generation failed:",h)}}c(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(y,{title:s("Expense Report")}),x&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:s("Generating PDF...")})]})})}),e.jsxs("div",{className:"report-container mx-auto max-w-5xl bg-card p-8",children:[e.jsx("div",{className:"mb-8 border-b-2 border-border pb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold text-foreground",children:t("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-0.5 text-sm text-muted-foreground",children:[t("company_address")&&e.jsx("p",{children:t("company_address")}),(t("company_city")||t("company_state")||t("company_zipcode"))&&e.jsxs("p",{children:[t("company_city"),t("company_state")&&`, ${t("company_state")}`," ",t("company_zipcode")]}),t("company_country")&&e.jsx("p",{children:t("company_country")})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-3 text-2xl font-bold text-foreground",children:s("EXPENSE REPORT")}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[o(d.from_date)," ",s("to")," ",o(d.to_date)]})]})]})}),e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-black",children:[e.jsx("th",{className:"w-16 px-3 py-2 text-start text-sm font-semibold",children:s("Rank")}),e.jsx("th",{className:"w-24 px-3 py-2 text-start text-sm font-semibold",children:s("Account Code")}),e.jsx("th",{className:"px-3 py-2 text-start text-sm font-semibold",children:s("Expense Category")}),e.jsx("th",{className:"w-32 px-3 py-2 text-end text-sm font-semibold",children:s("Amount")}),e.jsx("th",{className:"w-24 px-3 py-2 text-end text-sm font-semibold",children:s("% of Total")})]})}),e.jsxs("tbody",{children:[(i=r.expenses)==null?void 0:i.map((a,n)=>e.jsxs("tr",{className:"page-break-inside-avoid border-b border-border",children:[e.jsx("td",{className:"px-3 py-2 text-sm font-medium",children:n+1}),e.jsx("td",{className:"px-3 py-2 text-sm",children:a.account_code}),e.jsx("td",{className:"break-words px-3 py-2 text-sm",children:a.account_name}),e.jsx("td",{className:"px-3 py-2 text-end text-sm font-semibold tabular-nums",children:m(a.amount)}),e.jsxs("td",{className:"px-3 py-2 text-end text-sm tabular-nums",children:[p(a.amount),"%"]})]},n)),e.jsxs("tr",{className:"border-t-2 border-black",children:[e.jsx("td",{colSpan:3,className:"px-3 py-3 text-sm font-bold",children:s("Total Expenses")}),e.jsx("td",{className:"px-3 py-3 text-end text-sm font-bold tabular-nums",children:m(r.total_expenses)}),e.jsx("td",{className:"px-3 py-3 text-end text-sm font-bold tabular-nums",children:"100%"})]})]})]}),e.jsx("div",{className:"mt-8 border-t pt-4 text-center text-xs text-muted-foreground",children:e.jsxs("p",{children:[s("Generated on")," ",o(new Date().toISOString())]})})]}),e.jsx("style",{children:`
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
            `})]})}export{w as default};
