import{S as h,X as f,r as x,_ as j,j as e,T as u}from"./vendor-BH9DiYmt.js";import{b as a,a as o,f as c}from"./helpers-BgvDp0PB.js";function g(){const{t:s}=h(),{data:i,filters:d}=f().props,[m,l]=x.useState(!1);x.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&p()},[]);const p=async()=>{l(!0);const t=document.querySelector(".report-container");if(t){const n={margin:.25,filename:"journal-entry-report.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"landscape"}};try{await j().set(n).from(t).save(),setTimeout(()=>window.close(),1e3)}catch(r){console.error("PDF generation failed:",r)}}l(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(u,{title:s("Journal Entry Report")}),m&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:s("Generating PDF...")})]})})}),e.jsxs("div",{className:"report-container mx-auto max-w-6xl bg-card p-8",children:[e.jsx("div",{className:"mb-8 border-b-2 border-border pb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold text-foreground",children:a("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-0.5 text-sm text-muted-foreground",children:[a("company_address")&&e.jsx("p",{children:a("company_address")}),(a("company_city")||a("company_state")||a("company_zipcode"))&&e.jsxs("p",{children:[a("company_city"),a("company_state")&&`, ${a("company_state")}`," ",a("company_zipcode")]}),a("company_country")&&e.jsx("p",{children:a("company_country")})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-3 text-2xl font-bold text-foreground",children:s("JOURNAL ENTRY REPORT")}),d.from_date&&d.to_date&&e.jsxs("p",{className:"text-sm text-muted-foreground",children:[o(d.from_date)," ",s("to")," ",o(d.to_date)]})]})]})}),i==null?void 0:i.map(t=>{var n;return e.jsxs("div",{className:"page-break-inside-avoid mb-6 border border-border p-4",children:[e.jsxs("div",{className:"mb-3 flex justify-between border-b border-border pb-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-base font-bold",children:t.journal_number}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[o(t.date)," | ",t.reference_type]}),e.jsx("p",{className:"text-sm text-foreground",children:t.description})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("p",{className:"text-sm font-semibold",children:t.status==="posted"?s("Posted"):s("Draft")}),!t.is_balanced&&e.jsx("p",{className:"text-sm font-semibold text-destructive",children:s("Unbalanced")})]})]}),e.jsxs("table",{className:"w-full border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b-2 border-black",children:[e.jsx("th",{className:"w-24 px-2 py-2 text-start text-sm font-semibold",children:s("Account Code")}),e.jsx("th",{className:"w-48 px-2 py-2 text-start text-sm font-semibold",children:s("Account Name")}),e.jsx("th",{className:"px-2 py-2 text-start text-sm font-semibold",children:s("Description")}),e.jsx("th",{className:"w-28 px-2 py-2 text-end text-sm font-semibold",children:s("Debit")}),e.jsx("th",{className:"w-28 px-2 py-2 text-end text-sm font-semibold",children:s("Credit")})]})}),e.jsxs("tbody",{children:[(n=t.items)==null?void 0:n.map((r,b)=>e.jsxs("tr",{className:"border-b border-border",children:[e.jsx("td",{className:"px-2 py-2 text-sm",children:r.account_code}),e.jsx("td",{className:"px-2 py-2 text-sm",children:r.account_name}),e.jsx("td",{className:"break-words px-2 py-2 text-sm",children:r.description}),e.jsx("td",{className:"px-2 py-2 text-end text-sm tabular-nums",children:r.debit>0?c(r.debit):"-"}),e.jsx("td",{className:"px-2 py-2 text-end text-sm tabular-nums",children:r.credit>0?c(r.credit):"-"})]},b)),e.jsxs("tr",{className:"border-t-2 border-black",children:[e.jsx("td",{colSpan:3,className:"px-2 py-2 text-sm font-bold",children:s("Total")}),e.jsx("td",{className:"px-2 py-2 text-end text-sm font-bold tabular-nums",children:c(t.total_debit)}),e.jsx("td",{className:"px-2 py-2 text-end text-sm font-bold tabular-nums",children:c(t.total_credit)})]})]})]})]},t.id)}),e.jsx("div",{className:"mt-8 border-t pt-4 text-center text-xs text-muted-foreground",children:e.jsxs("p",{children:[s("Generated on")," ",o(new Date().toISOString())]})})]}),e.jsx("style",{children:`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4 landscape;
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
            `})]})}export{g as default};
