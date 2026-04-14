import{S as b,X as h,r as c,_ as f,j as e,T as j}from"./vendor-BH9DiYmt.js";import{b as a,a as i,f as n}from"./helpers-BgvDp0PB.js";function N(){const{t:s}=b(),{data:t,filters:d}=h().props,[l,o]=c.useState(!1);c.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&m()},[]);const m=async()=>{o(!0);const r=document.querySelector(".report-container");if(r){const x={margin:.25,filename:"cash-flow-statement.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await f().set(x).from(r).save(),setTimeout(()=>window.close(),1e3)}catch(p){console.error("PDF generation failed:",p)}}o(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(j,{title:s("Cash Flow Statement")}),l&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:s("Generating PDF...")})]})})}),e.jsxs("div",{className:"report-container mx-auto max-w-5xl bg-card p-8",children:[e.jsx("div",{className:"mb-8 border-b-2 border-border pb-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-2 text-3xl font-bold text-foreground",children:a("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-0.5 text-sm text-muted-foreground",children:[a("company_address")&&e.jsx("p",{children:a("company_address")}),(a("company_city")||a("company_state")||a("company_zipcode"))&&e.jsxs("p",{children:[a("company_city"),a("company_state")&&`, ${a("company_state")}`," ",a("company_zipcode")]}),a("company_country")&&e.jsx("p",{children:a("company_country")})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("h2",{className:"mb-3 text-2xl font-bold text-foreground",children:s("CASH FLOW STATEMENT")}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:[i(d.from_date)," ",s("to")," ",i(d.to_date)]})]})]})}),e.jsx("table",{className:"w-full border-collapse",children:e.jsxs("tbody",{children:[e.jsxs("tr",{className:"page-break-inside-avoid border-b-2 border-black",children:[e.jsx("td",{className:"py-3 text-sm font-bold",children:s("Beginning Cash Balance")}),e.jsx("td",{className:"w-40 py-3 text-end text-sm font-bold tabular-nums",children:n(t.beginning_cash)})]}),e.jsx("tr",{className:"page-break-inside-avoid",children:e.jsx("td",{colSpan:2,className:"pb-2 pt-6",children:e.jsx("h3",{className:"text-base font-bold",children:s("Cash Flow from Operating Activities")})})}),e.jsxs("tr",{className:"page-break-inside-avoid",children:[e.jsx("td",{className:"py-2 ps-6 text-sm",children:s("Net cash from operations")}),e.jsx("td",{className:"py-2 text-end text-sm font-semibold tabular-nums",children:n(t.operating)})]}),e.jsx("tr",{className:"page-break-inside-avoid",children:e.jsx("td",{colSpan:2,className:"pb-2 pt-4",children:e.jsx("h3",{className:"text-base font-bold",children:s("Cash Flow from Investing Activities")})})}),e.jsxs("tr",{className:"page-break-inside-avoid",children:[e.jsx("td",{className:"py-2 ps-6 text-sm",children:s("Net cash from investing")}),e.jsx("td",{className:"py-2 text-end text-sm font-semibold tabular-nums",children:n(t.investing)})]}),e.jsx("tr",{className:"page-break-inside-avoid",children:e.jsx("td",{colSpan:2,className:"pb-2 pt-4",children:e.jsx("h3",{className:"text-base font-bold",children:s("Cash Flow from Financing Activities")})})}),e.jsxs("tr",{className:"page-break-inside-avoid",children:[e.jsx("td",{className:"py-2 ps-6 text-sm",children:s("Net cash from financing")}),e.jsx("td",{className:"py-2 text-end text-sm font-semibold tabular-nums",children:n(t.financing)})]}),e.jsxs("tr",{className:"page-break-inside-avoid border-t-2 border-border",children:[e.jsx("td",{className:"py-3 text-sm font-bold",children:s("Net Increase/Decrease in Cash")}),e.jsx("td",{className:"py-3 text-end text-sm font-bold tabular-nums",children:n(t.net_cash_flow)})]}),e.jsxs("tr",{className:"page-break-inside-avoid border-t-4 border-black",children:[e.jsx("td",{className:"py-4 text-base font-bold",children:s("Ending Cash Balance")}),e.jsx("td",{className:"py-4 text-end text-base font-bold tabular-nums",children:n(t.ending_cash)})]})]})}),e.jsx("div",{className:"mt-8 border-t pt-4 text-center text-xs text-muted-foreground",children:e.jsxs("p",{children:[s("Generated on")," ",i(new Date().toISOString())]})})]}),e.jsx("style",{children:`
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
            `})]})}export{N as default};
