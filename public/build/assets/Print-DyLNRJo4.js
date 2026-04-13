import{r as d,j as e}from"./ui-CPJPuvru.js";import{X as f,S as b}from"./app-r9u0l19b.js";import{a as j}from"./html2pdf-C4QYQydl.js";import{a as r,b as s,f as o}from"./helpers-BisrqTeU.js";import{u}from"./useTranslation-CV_3kzxc.js";function w(){var l,c;const{t:a}=u(),{profitLoss:n}=f().props,[m,i]=d.useState(!1);d.useEffect(()=>{new URLSearchParams(window.location.search).get("download")==="pdf"&&p()},[]);const p=async()=>{i(!0);const t=document.querySelector(".profit-loss-container");if(t){const x={margin:.25,filename:`profit-loss-${r(n.from_date)}-to-${r(n.to_date)}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"a4",orientation:"portrait"}};try{await j().set(x).from(t).save(),setTimeout(()=>window.close(),1e3)}catch(h){console.error("PDF generation failed:",h)}}i(!1)};return e.jsxs("div",{className:"min-h-screen bg-card",children:[e.jsx(b,{title:a("Profit & Loss Statement")}),m&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50",children:e.jsx("div",{className:"rounded-lg bg-card p-6 shadow-lg",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"}),e.jsx("p",{className:"text-lg font-semibold text-foreground",children:a("Generating PDF...")})]})})}),e.jsxs("div",{className:"profit-loss-container mx-auto max-w-4xl bg-card p-12",children:[e.jsxs("div",{className:"mb-12 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"mb-4 text-2xl font-bold",children:s("company_name")||"YOUR COMPANY"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[s("company_address")&&e.jsx("p",{children:s("company_address")}),(s("company_city")||s("company_state")||s("company_zipcode"))&&e.jsxs("p",{children:[s("company_city"),s("company_state")&&`, ${s("company_state")}`," ",s("company_zipcode")]}),s("company_country")&&e.jsx("p",{children:s("company_country")}),s("company_telephone")&&e.jsxs("p",{children:[a("Phone"),": ",s("company_telephone")]}),s("company_email")&&e.jsxs("p",{children:[a("Email"),": ",s("company_email")]})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("h2",{className:"mb-2 text-2xl font-bold",children:a("PROFIT & LOSS STATEMENT")}),e.jsx("div",{className:"space-y-1 text-sm",children:e.jsxs("p",{children:[a("Period"),": ",r(n.from_date)," - ",r(n.to_date)]})})]})]}),e.jsxs("div",{className:"mb-6 grid grid-cols-2 gap-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-3 border-b-2 border-border pb-2 text-base font-bold",children:a("Revenue")}),n.revenue.length>0?(l=n.revenue)==null?void 0:l.map(t=>e.jsxs("div",{className:"flex justify-between py-1.5 text-sm",children:[e.jsxs("span",{children:[t.account_code," - ",t.account_name]}),e.jsx("span",{className:"tabular-nums",children:o(t.balance)})]},t.id)):e.jsx("p",{className:"py-2 text-sm",children:a("No revenue accounts")}),e.jsxs("div",{className:"mt-2 flex justify-between border-t py-2 text-sm font-semibold",children:[e.jsx("span",{children:a("Total Revenue")}),e.jsx("span",{className:"tabular-nums",children:o(n.total_revenue)})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-3 border-b-2 border-border pb-2 text-base font-bold",children:a("Expenses")}),n.expenses.length>0?(c=n.expenses)==null?void 0:c.map(t=>e.jsxs("div",{className:"flex justify-between py-1.5 text-sm",children:[e.jsxs("span",{children:[t.account_code," - ",t.account_name]}),e.jsx("span",{className:"tabular-nums",children:o(t.balance)})]},t.id)):e.jsx("p",{className:"py-2 text-sm",children:a("No expense accounts")}),e.jsxs("div",{className:"mt-2 flex justify-between border-t py-2 text-sm font-semibold",children:[e.jsx("span",{children:a("Total Expenses")}),e.jsx("span",{className:"tabular-nums",children:o(n.total_expenses)})]})]})]}),e.jsx("div",{className:"mt-8 border-t-2 border-border pt-4",children:e.jsxs("div",{className:"flex justify-between py-2 text-base font-bold",children:[e.jsx("span",{children:n.net_profit>=0?a("Net Profit"):a("Net Loss")}),e.jsx("span",{className:"tabular-nums",children:o(Math.abs(n.net_profit))})]})}),e.jsx("div",{className:"mt-12 border-t pt-6 text-center text-sm text-muted-foreground",children:e.jsxs("p",{children:[a("Generated on")," ",r(new Date().toISOString())]})})]}),e.jsx("style",{children:`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .profit-loss-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .profit-loss-container {
                        box-shadow: none;
                    }
                }
            `})]})}export{w as default};
