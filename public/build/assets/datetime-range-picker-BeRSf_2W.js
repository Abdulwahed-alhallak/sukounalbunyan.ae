import{S as y,r as g,j as r,ab as v}from"./vendor-DJjzF8sm.js";import{c as k}from"./utils-BkfiQ9Th.js";import{B as D}from"./button-DZDX_WaT.js";import{P as T,a as $,b as N}from"./popover-DIA8Rv1r.js";import{g as C}from"./icons-BJYW6LHv.js";function B({value:i,onChange:d,placeholder:_,className:w,id:P,required:E,timeFormat:u="HH:mm",dateFormat:h="MMM d, yyyy h:mm aa",mode:t="range"}){const{t:c}=y(),[b,f]=g.useState(!1),[a,p]=g.useState(null),[o,m]=g.useState(null);g.useEffect(()=>{if(i)if(t==="single")p(new Date(i.replace(" ","T"))),m(null);else{const[e,n]=i.split(" - ");p(e?new Date(e.replace(" ","T")):null),m(n?new Date(n.replace(" ","T")):null)}else p(null),m(null)},[i,t]);const S=(e,n)=>{const l={year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};return t==="single"?e?e.toLocaleDateString("en-US",l):"":!e||!n?"":`${e.toLocaleDateString("en-US",l)} - ${n.toLocaleDateString("en-US",l)}`},s=e=>{const n=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,l=`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}`;return`${n} ${l}`},x=e=>{e&&(p(e),t==="single"?(d(s(e)),f(!1)):d(o?`${s(e)} - ${s(o)}`:`${s(e)} - `))},j=e=>{e&&a&&(m(e),d(`${s(a)} - ${s(e)}`),f(!1))};return r.jsxs("div",{className:k("w-full",w),onWheel:e=>{b||e.stopPropagation()},children:[r.jsxs(T,{open:b,onOpenChange:f,modal:!1,children:[r.jsx($,{asChild:!0,children:r.jsxs(D,{variant:"outline",className:k("h-10 w-full justify-start text-start font-normal",!i&&"text-muted-foreground"),children:[r.jsx(C,{className:"me-2 h-4 w-4"}),i&&a&&(t==="single"||o)?S(a,o):_||c(t==="single"?"Select date time":"Select date time range")]})}),r.jsx(N,{className:"w-auto p-0",align:"start",onWheel:e=>{e.stopPropagation()},children:r.jsx("div",{className:"datetime-range-wrapper",children:t==="single"?r.jsxs("div",{className:"p-3",children:[r.jsx("div",{className:"mb-2 text-center text-sm font-medium",children:c("Select Date & Time")}),r.jsx(v,{selected:a,onChange:x,showTimeSelect:!0,timeFormat:u,timeIntervals:15,timeCaption:"Time",dateFormat:h,inline:!0})]}):r.jsxs("div",{className:"flex",children:[r.jsxs("div",{className:"border-e border-border p-3",children:[r.jsx("div",{className:"mb-2 text-center text-sm font-medium",children:c("Start Date & Time")}),r.jsx(v,{selected:a,onChange:x,showTimeSelect:!0,timeFormat:u,timeIntervals:15,timeCaption:"Time",dateFormat:h,inline:!0,maxDate:o||void 0})]}),r.jsxs("div",{className:"p-3",children:[r.jsx("div",{className:"mb-2 text-center text-sm font-medium",children:c("End Date & Time")}),r.jsx(v,{selected:o,onChange:j,showTimeSelect:!0,timeFormat:u,timeIntervals:15,timeCaption:"Time",dateFormat:h,inline:!0,minDate:a||void 0})]})]})})})]}),r.jsx("style",{children:`
        .datetime-range-wrapper .react-datepicker {
          font-family: inherit;
          border: none;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .datetime-range-wrapper .react-datepicker__header {
          background: hsl(var(--background));
          border-bottom: 1px solid hsl(var(--border));
          border-radius: 0;
        }
        .datetime-range-wrapper .react-datepicker__current-month,
        .datetime-range-wrapper .react-datepicker__day-name {
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        .datetime-range-wrapper .react-datepicker__day {
          color: hsl(var(--foreground));
          border-radius: 6px;
        }
        .datetime-range-wrapper .react-datepicker__day:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        .datetime-range-wrapper .react-datepicker__day--selected {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .datetime-range-wrapper .react-datepicker__navigation {
          border: none;
          border-radius: 6px;
        }
        .datetime-range-wrapper .react-datepicker__navigation:hover {
          background: hsl(var(--accent));
        }
        .datetime-range-wrapper .react-datepicker__navigation-icon::before {
          border-color: hsl(var(--foreground));
        }
        .datetime-range-wrapper .react-datepicker__day--outside-month {
          color: hsl(var(--muted-foreground));
        }
        .datetime-range-wrapper .react-datepicker__day--disabled {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }
        .datetime-range-wrapper .react-datepicker__time-container {
          background: hsl(var(--background));
          border-left: 1px solid hsl(var(--border));
        }
        .datetime-range-wrapper .react-datepicker__time {
          background: hsl(var(--background));
        }
        .datetime-range-wrapper .react-datepicker__time-box {
          background: hsl(var(--background));
        }
        .datetime-range-wrapper .react-datepicker__time-list-item {
          color: hsl(var(--foreground));
        }
        .datetime-range-wrapper .react-datepicker__time-list-item:hover {
          background: hsl(var(--accent));
        }
        .datetime-range-wrapper .react-datepicker__time-list-item--selected {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .datetime-range-wrapper .react-datepicker__time-name {
          color: hsl(var(--foreground));
        }
      `})]})}export{B as D};
