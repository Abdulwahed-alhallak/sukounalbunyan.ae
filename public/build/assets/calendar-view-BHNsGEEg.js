import{S as b,r as d,j as o,ad as h,ae as g,af as v,ag as x}from"./vendor-DngcTFBE.js";function w({events:t,onEventClick:e,onDateClick:a,onMonthChange:l}){const{t:i}=b(),[c,s]=d.useState(!1),f=d.useMemo(()=>t.map(r=>{new Date(r.startDate);const n=new Date(r.endDate),p=r.startDate!==r.endDate?new Date(n.getTime()+1440*60*1e3).toISOString().split("T")[0]:void 0;return{id:r.id.toString(),title:r.title,start:r.startDate,end:p,allDay:!0,backgroundColor:r.color,borderColor:r.color,extendedProps:r}}),[t]),m=r=>{e==null||e(r.event.extendedProps)},u=r=>{a==null||a(new Date(r.dateStr))};return o.jsxs("div",{className:"fullcalendar-container",style:{overflow:"visible"},children:[o.jsx(h,{plugins:[g,v,x],initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"},events:f,height:"auto",eventClick:m,dateClick:u,datesSet:r=>{if(c){const n=r.start.toISOString().slice(0,7);l==null||l(n)}else s(!0)},dayMaxEventRows:3,moreLinkText:i("more"),allDayText:i("All day"),eventMaxStack:3}),o.jsx("style",{children:`
        .fullcalendar-container {
          overflow: visible !important;
        }
        
        .fullcalendar-container .fc {
          font-family: inherit;
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: visible !important;
          background: hsl(var(--card));
        }
        
        .fullcalendar-container .fc-toolbar {
          margin-bottom: 0;
          padding: 1rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        
        @media (max-width: 768px) {
          .fullcalendar-container .fc-toolbar {
            padding: 0.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .fullcalendar-container .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
          
          .fullcalendar-container .fc-button {
            padding: 0.375rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .fullcalendar-container .fc-toolbar-title {
            font-size: 1rem;
            text-align: center;
          }
          
          .fullcalendar-container .fc-view-harness {
            padding: 0.5rem;
          }
          
          .fullcalendar-container .fc-daygrid-day-number {
            padding: 0.25rem;
            font-size: 0.75rem;
          }
          
          .fullcalendar-container .fc-event {
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
            margin: 0.125rem;
            min-height: 1.5rem;
          }
          
          .fullcalendar-container .fc-event-title {
            font-size: 0.7rem;
          }
          
          .fullcalendar-container .fc-col-header-cell {
            padding: 0.5rem 0.25rem;
            font-size: 0.75rem;
          }
        }
        
        .fullcalendar-container .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        
        .fullcalendar-container .fc-button {
          background: hsl(var(--primary));
          border: 1px solid hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          text-transform: capitalize;
        }
        
        .fullcalendar-container .fc-button:hover {
          background: hsl(var(--primary) / 0.9) !important;
          border-color: hsl(var(--primary) / 0.9) !important;
        }
        
        .fullcalendar-container .fc-button-active {
          background: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary)) !important;
        }
        
        .fullcalendar-container .fc-view-harness {
          padding: 1rem;
          overflow: visible !important;
        }
        
        .fullcalendar-container .fc-daygrid-day {
          cursor: pointer;
          border: 1px solid hsl(var(--border));
          transition: all 0.2s ease;
          overflow: visible !important;
        }
        
        .fullcalendar-container .fc-daygrid-day:first-child {
          border-left: 1px solid hsl(var(--border));
        }
        
        .fullcalendar-container .fc-daygrid-day:hover {
          background: hsl(var(--accent));
        }
        
        .fullcalendar-container .fc-daygrid-day-number {
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        
        .fullcalendar-container .fc-event {
          border-radius: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.8rem;
          border: none;
          margin: 0.25rem;
          min-height: 2rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        
        .fullcalendar-container .fc-event:hover {
          opacity: 0.9;
        }
        
        .fullcalendar-container .fc-daygrid-event {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        
        .fullcalendar-container .fc-event-title {
          font-weight: 600;
          font-size: 0.8rem;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          color: hsl(var(--primary-foreground)) !important;
        }
        
        .fullcalendar-container .fc-event-main {
          width: 100%;
          display: flex;
          align-items: center;
        }
        
        .fullcalendar-container .fc-event-main-frame {
          width: 100%;
          display: flex;
          align-items: center;
        }
        
        .fullcalendar-container .fc-day-today {
          background: hsl(var(--accent)) !important;
          border: 2px solid hsl(var(--foreground) / 0.15) !important;
        }
        
        .fullcalendar-container .fc-col-header-cell {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          font-weight: 600;
          color: hsl(var(--foreground));
          padding: 0.75rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .fullcalendar-container .fc-col-header-cell:first-child {
          border-left: 1px solid hsl(var(--border));
        }
        
        .fullcalendar-container .fc-popover {
          z-index: 9999 !important;
          max-height: 400px;
        }
        
        .fullcalendar-container .fc-more-popover {
          z-index: 9999 !important;
          max-height: 400px;
        }
        
        .fullcalendar-container .fc-popover-body {
          max-height: 350px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .fullcalendar-container .fc-daygrid-event-harness {
          margin-bottom: 2px;
        }
        
        .fullcalendar-container .fc-daygrid-body,
        .fullcalendar-container .fc-scrollgrid,
        .fullcalendar-container .fc-scrollgrid-section,
        .fullcalendar-container .fc-scroller {
          overflow: visible !important;
        }
        
        .fullcalendar-container .fc-popover-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .fullcalendar-container .fc-popover-body::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        
        .fullcalendar-container .fc-popover-body::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground));
          border-radius: 3px;
        }
        
        .fullcalendar-container .fc-popover-body::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--foreground));
        }
      
      `})]})}export{w as C};
