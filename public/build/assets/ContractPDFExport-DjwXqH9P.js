const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vendor-DngcTFBE.js","./vendor-CE21K4bl.css"])))=>i.map(i=>d[i]);
import{_ as f}from"./app-BYeqcIvm.js";import{S as x,j as i}from"./vendor-DngcTFBE.js";import{B as h}from"./button-C8NYO54c.js";import{a as v,b as u,c as b}from"./tooltip-Cc2HOG7D.js";import{f as _,a as n,k as s}from"./helpers-BcriV97N.js";import{Y as y}from"./icons-DYDPm3rK.js";import"./radix-B7cUMZbO.js";import"./utils-Baab6ACa.js";function S({contract:e,variant:a="outline",size:p="sm"}){const{t}=x(),m=()=>{var l,d;const r=document.createElement("div");r.innerHTML=`
            <div style="padding: 40px; font-family: Arial, sans-serif;">
                <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px;">
                    <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 8px;">${e.subject}</h1>
                    <p style="color: hsl(var(--muted-foreground));">${e.contract_number}</p>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">${t("Contract Details")}</h3>
                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 14px; font-weight: 500; color: hsl(var(--muted-foreground));">${t("Client")}</label>
                            <p style="font-weight: 500; color: #111827;">${((l=e.user)==null?void 0:l.name)||t("Not Assigned")}</p>
                        </div>
                        <div>
                            <label style="font-size: 14px; font-weight: 500; color: hsl(var(--muted-foreground));">${t("Contract Value")}</label>
                            <p style="font-size: 18px; font-weight: 600; color: #111827;">${e.value?_(e.value):t("Not Set")}</p>
                        </div>
                    </div>
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">${t("Timeline")}</h3>
                        <div style="margin-bottom: 16px;">
                            <label style="font-size: 14px; font-weight: 500; color: hsl(var(--muted-foreground));">${t("Start Date")}</label>
                            <p style="font-weight: 500; color: #111827;">${e.start_date?n(e.start_date):t("Not Set")}</p>
                        </div>
                        <div>
                            <label style="font-size: 14px; font-weight: 500; color: hsl(var(--muted-foreground));">${t("End Date")}</label>
                            <p style="font-weight: 500; color: #111827;">${e.end_date?n(e.end_date):t("Not Set")}</p>
                        </div>
                    </div>
                </div>
                ${e.description?`
                    <div style="margin-bottom: 32px;">
                        <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px;">${t("Terms and Conditions")}</h3>
                        <div style="border-left: 4px solid #d1d5db; padding-left: 16px;">
                            <p style="color: hsl(var(--foreground)); line-height: 1.6; white-space: pre-wrap;">${e.description}</p>
                        </div>
                    </div>
                `:""}
                <div style="border-top: 1px solid #e5e7eb; padding-top: 32px;">
                    <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 24px;">${t("Signatures")}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
                        ${e.signatures&&e.signatures.length>0?(d=e.signatures)==null?void 0:d.map(o=>`
                                <div style="text-align: center;">
                                    <div style="border-bottom: 2px solid #9ca3af; padding-bottom: 8px; margin-bottom: 12px; height: 64px; display: flex; align-items: end; justify-content: center;">
                                        <img src="${o.signature_data}" alt="Signature" style="max-height: 48px; max-width: 100%; object-fit: contain;" />
                                    </div>
                                    <p style="font-weight: 500; color: #111827;">${o.user.name}</p>
                                    <p style="font-size: 14px; color: hsl(var(--muted-foreground));">${s(o.signed_at)}</p>
                                </div>
                            `).join(""):`<div style="text-align: center;">
                                <div style="border-bottom: 2px solid #d1d5db; padding-bottom: 8px; margin-bottom: 12px; height: 64px;"></div>
                                <p style="font-weight: 500; color: #111827;">${t("Client Signature")}</p>
                                <p style="font-size: 14px; color: hsl(var(--muted-foreground));">${t("Date")}: _______________</p>
                            </div>
                            <div style="text-align: center;">
                                <div style="border-bottom: 2px solid #d1d5db; padding-bottom: 8px; margin-bottom: 12px; height: 64px;"></div>
                                <p style="font-weight: 500; color: #111827;">${t("Company Representative")}</p>
                                <p style="font-size: 14px; color: hsl(var(--muted-foreground));">${t("Date")}: _______________</p>
                            </div>`}
                    </div>
                </div>
                <div style="text-align: center; font-size: 12px; color: hsl(var(--muted-foreground)); padding-top: 32px; margin-top: 32px; border-top: 1px solid #e5e7eb;">
                    <p>${t("Generated on")} ${s(e.created_at)} • ${e.contract_number}</p>
                </div>
            </div>
        `;const g={margin:.5,filename:`contract-${e.contract_number}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"in",format:"letter",orientation:"portrait"}};f(()=>import("./vendor-DngcTFBE.js").then(o=>o.h),__vite__mapDeps([0,1]),import.meta.url).then(o=>{o.default().set(g).from(r).save()})};return i.jsxs(v,{children:[i.jsx(u,{asChild:!0,children:i.jsx(h,{variant:a,size:p,onClick:m,children:i.jsx(y,{className:"h-4 w-4"})})}),i.jsx(b,{children:i.jsx("p",{children:t("Download PDF")})})]})}export{S as default};
