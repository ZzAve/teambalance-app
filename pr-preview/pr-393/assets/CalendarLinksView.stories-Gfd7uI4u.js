import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-u5hs3rCW.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-C1NV3wA_.js";import{n as s,t as c}from"./input-CoQz6B7t.js";import{n as l,t as u}from"./label-BqlNu_e-.js";import{n as d,t as f}from"./ConfirmDialog-4wAO2q3W.js";import{n as p,t as m}from"./FormError-B3b4LG7B.js";import{n as h,t as g}from"./QueryErrorState-D83TMohp.js";function _(e){return e.replace(/^https?:\/\//,`webcal://`)}function v(e){return`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(_(e))}`}function y(e){return e.label??`Link from ${b(e.createdAt)}`}function b(e){return new Date(e).toLocaleDateString(`nl-NL`,{day:`numeric`,month:`short`,year:`numeric`})}function x({links:e=[],isLoading:t,isError:n,isSaving:r,actionError:i,copiedId:a,copyFailedId:s,onGenerate:l,onDelete:d,onCopy:p,onRetry:h}){let[_,v]=(0,C.useState)(``),[y,b]=(0,C.useState)(null),x=e.length>=T;return(0,w.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Subscribe to your team's events once and your phone's calendar stays in sync. Changes can take up to a day to appear on Google Calendar.`}),t&&(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`Loading…`}),n&&(0,w.jsx)(g,{title:`Couldn't load your calendar links`,description:`Check your connection and try again.`,onRetry:h}),!t&&!n&&(0,w.jsxs)(w.Fragment,{children:[e.length===0?(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`No calendar links yet.`}):(0,w.jsx)(`ul`,{className:`divide-y divide-border rounded-lg border border-border`,children:e.map(e=>(0,w.jsx)(S,{link:e,copied:a===e.id,copyFailed:s===e.id,isSaving:r,onCopy:p,onRequestDelete:b},e.id))}),(0,w.jsxs)(`form`,{className:`flex flex-col gap-2`,onSubmit:e=>{e.preventDefault(),l(_.trim()||void 0),v(``)},children:[(0,w.jsx)(u,{htmlFor:`calendar-link-label`,children:`Label (optional)`}),(0,w.jsxs)(`div`,{className:`flex gap-2`,children:[(0,w.jsx)(c,{id:`calendar-link-label`,value:_,maxLength:E,placeholder:`e.g. My phone`,disabled:x,onChange:e=>v(e.target.value)}),(0,w.jsx)(o,{type:`submit`,disabled:x||r,children:`Generate link`})]}),x&&(0,w.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[`You have `,T,` links, the maximum. Delete one to generate a new link.`]}),i&&(0,w.jsx)(m,{children:`Something went wrong. Please try again.`})]}),(0,w.jsx)(f,{open:y!==null,title:`Delete calendar link?`,description:`Every calendar subscribed with this link stops updating.`,confirmLabel:`Delete link`,onConfirm:()=>{y&&d(y.id),b(null)},onCancel:()=>b(null)})]})]})}function S({link:e,copied:t,copyFailed:n,isSaving:r,onCopy:i,onRequestDelete:a}){let s=y(e);return(0,w.jsxs)(`li`,{"aria-label":s,className:`flex flex-col gap-3 p-3`,children:[(0,w.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,w.jsx)(`span`,{className:`min-w-0 flex-1 truncate font-medium`,title:s,children:s}),e.expired&&(0,w.jsx)(`span`,{className:`shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red`,children:`Expired`})]}),(0,w.jsxs)(`p`,{className:`text-small text-muted-foreground`,children:[e.expired?`Expired`:`Expires`,` `,b(e.expiresAt)]}),(0,w.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[e.url?(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(o,{asChild:!0,size:`sm`,variant:`outline`,children:(0,w.jsx)(`a`,{href:_(e.url),children:`Open in Calendar`})}),(0,w.jsx)(o,{asChild:!0,size:`sm`,variant:`outline`,children:(0,w.jsx)(`a`,{href:v(e.url),target:`_blank`,rel:`noopener noreferrer`,children:`Add to Google Calendar`})}),(0,w.jsx)(o,{size:`sm`,variant:`outline`,onClick:()=>i(e),children:t?`Copied!`:`Copy link`})]}):(0,w.jsx)(`p`,{className:`text-small text-muted-foreground`,children:`This link can no longer be shown.`}),(0,w.jsx)(o,{size:`sm`,variant:`ghost`,className:`text-red`,disabled:r,onClick:()=>a(e),children:`Delete`})]}),n&&e.url&&(0,w.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,w.jsx)(m,{children:`Couldn't copy automatically. Copy the link below.`}),(0,w.jsx)(c,{readOnly:!0,"aria-label":`Calendar link URL for ${s}`,value:e.url,onFocus:e=>e.currentTarget.select()})]})]})}var C,w,T,E;function D(){return(D=e((()=>{C=t(),a(),s(),l(),d(),p(),h(),w=n(),T=3,E=50,x.__docgenInfo={description:`The member's calendar links for this team: a short explainer, the list with its per-link actions,
and the generate form. Prop-only; the query, the mutations, the clipboard write and the copied
flag live in the CalendarLinks container (ADR-0017). Owns only the label field and the
delete-confirm target.`,methods:[],displayName:`CalendarLinksView`,props:{links:{required:!1,tsType:{name:`Array`,elements:[{name:`CalendarLink`}],raw:`CalendarLink[]`},description:`The member's links in this team, newest first, as the server returned them.`,defaultValue:{value:`[]`,computed:!1}},isLoading:{required:!1,tsType:{name:`boolean`},description:``},isError:{required:!1,tsType:{name:`boolean`},description:``},isSaving:{required:!1,tsType:{name:`boolean`},description:`A create or delete is in flight.`},actionError:{required:!1,tsType:{name:`boolean`},description:`The last create or delete failed.`},copiedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose URL was just copied, so its button can say so.`},copyFailedId:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`The link whose clipboard write the browser refused, so its URL can be copied by hand.`},onGenerate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(label: string | undefined) => void`,signature:{arguments:[{type:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},name:`label`}],return:{name:`void`}}},description:``},onDelete:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(id: string) => void`,signature:{arguments:[{type:{name:`string`},name:`id`}],return:{name:`void`}}},description:``},onCopy:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(link: CalendarLink) => void`,signature:{arguments:[{type:{name:`CalendarLink`},name:`link`}],return:{name:`void`}}},description:``},onRetry:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{r(),D(),O=n(),{expect:k,fn:A,within:j}=__STORYBOOK_MODULE_TEST__,M=`https://api.teambalance.nl/api/calendar/setpoint-vt`,N={id:`l3`,label:`My phone`,createdAt:`2026-09-01T10:00:00Z`,expiresAt:`2027-09-01T10:00:00Z`,expired:!1,url:`${M}/token-phone.ics`},P={id:`l2`,label:void 0,createdAt:`2026-03-14T10:00:00Z`,expiresAt:`2027-03-14T10:00:00Z`,expired:!1,url:`${M}/token-unlabelled.ics`},F={title:`features/calendar-links/CalendarLinksView`,component:x,args:{links:[N,P,{id:`l1`,label:`Old laptop`,createdAt:`2025-06-02T10:00:00Z`,expiresAt:`2026-06-02T10:00:00Z`,expired:!0,url:`${M}/token-laptop.ics`}],onGenerate:A(),onDelete:A(),onCopy:A(),onRetry:A()}},I={play:async({canvas:e})=>{let t=t=>j(e.getByRole(`listitem`,{name:t}));await k(t(`My phone`).getByText(`Expires 1 sep 2027`)).toBeInTheDocument(),await k(t(`Link from 14 mrt 2026`).getByText(`Expires 14 mrt 2027`)).toBeInTheDocument(),await k(t(`Old laptop`).getByText(`Expired`)).toBeInTheDocument(),await k(t(`My phone`).queryByText(`Expired`)).not.toBeInTheDocument(),await k(t(`My phone`).getByRole(`link`,{name:`Open in Calendar`})).toHaveAttribute(`href`,`webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics`);let n=t(`My phone`).getByRole(`link`,{name:`Add to Google Calendar`});await k(n).toHaveAttribute(`href`,`https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics`),await k(n).toHaveAttribute(`target`,`_blank`),await k(t(`Old laptop`).getByRole(`button`,{name:`Delete`})).toBeEnabled(),await k(e.getByRole(`button`,{name:`Generate link`})).toBeDisabled(),await k(e.getByText(/You have 3 links, the maximum/)).toBeInTheDocument()}},L={render:e=>(0,O.jsx)(i,{items:{Loading:(0,O.jsx)(x,{...e,isLoading:!0}),Error:(0,O.jsx)(x,{...e,isError:!0}),Empty:(0,O.jsx)(x,{...e,links:[]}),"Copy refused":(0,O.jsx)(x,{...e,links:[N],copyFailedId:`l3`})}}),play:async({canvas:e})=>{let t=t=>j(e.getByRole(`region`,{name:t}));await k(t(`Loading`).getByText(`Loading…`)).toBeInTheDocument(),await k(t(`Loading`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await k(t(`Error`).getByRole(`alert`)).toHaveTextContent(`Couldn't load your calendar links`),await k(t(`Error`).queryByRole(`button`,{name:`Generate link`})).not.toBeInTheDocument(),await k(t(`Empty`).getByText(`No calendar links yet.`)).toBeInTheDocument(),await k(t(`Empty`).getByRole(`button`,{name:`Generate link`})).toBeEnabled();let n=t(`Copy refused`);await k(n.getByRole(`alert`)).toHaveTextContent(`Couldn't copy automatically. Copy the link below.`),await k(n.getByLabelText(`Calendar link URL for My phone`)).toHaveValue(N.url),await k(n.getByRole(`button`,{name:`Copy link`})).toBeInTheDocument()}},R={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,O.jsx)(i,{items:{"Below the cap":(0,O.jsx)(x,{...e,links:[N,P],copiedId:`l2`}),Error:(0,O.jsx)(x,{...e,isError:!0})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=j(e.getByRole(`region`,{name:`Below the cap`})),i=j(document.body);await k(j(r.getByRole(`listitem`,{name:`Link from 14 mrt 2026`})).getByRole(`button`,{name:`Copied!`})).toBeInTheDocument();let a=j(r.getByRole(`listitem`,{name:`My phone`}));await t.click(a.getByRole(`button`,{name:`Copy link`})),await k(n.onCopy).toHaveBeenCalledWith(N),await t.click(a.getByRole(`button`,{name:`Delete`})),await k(await i.findByText(`Every calendar subscribed with this link stops updating.`)).toBeInTheDocument(),await k(i.getByRole(`heading`,{name:`Delete calendar link?`})).toBeInTheDocument(),await t.click(i.getByRole(`button`,{name:`Cancel`})),await k(n.onDelete).not.toHaveBeenCalled(),await t.click(a.getByRole(`button`,{name:`Delete`})),await t.click(await i.findByRole(`button`,{name:`Delete link`})),await k(n.onDelete).toHaveBeenCalledWith(`l3`),await t.click(r.getByRole(`button`,{name:`Generate link`})),await k(n.onGenerate).toHaveBeenLastCalledWith(void 0);let o=r.getByLabelText(`Label (optional)`);await k(o).toHaveAttribute(`maxLength`,`50`),await t.type(o,`  Work laptop {Enter}`),await k(n.onGenerate).toHaveBeenLastCalledWith(`Work laptop`),await k(o).toHaveValue(``),await t.click(j(e.getByRole(`region`,{name:`Error`})).getByRole(`button`,{name:`Retry`})),await k(n.onRetry).toHaveBeenCalled()}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    const row = (name: string) => within(canvas.getByRole('listitem', {
      name
    }));
    await expect(row('My phone').getByText('Expires 1 sep 2027')).toBeInTheDocument();
    // No label: the creation date names the link instead.
    await expect(row('Link from 14 mrt 2026').getByText('Expires 14 mrt 2027')).toBeInTheDocument();
    await expect(row('Old laptop').getByText('Expired')).toBeInTheDocument();
    await expect(row('My phone').queryByText('Expired')).not.toBeInTheDocument();

    // Every action on every link, no platform detection.
    await expect(row('My phone').getByRole('link', {
      name: 'Open in Calendar'
    })).toHaveAttribute('href', 'webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics');
    const google = row('My phone').getByRole('link', {
      name: 'Add to Google Calendar'
    });
    await expect(google).toHaveAttribute('href', 'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics');
    await expect(google).toHaveAttribute('target', '_blank');
    await expect(row('Old laptop').getByRole('button', {
      name: 'Delete'
    })).toBeEnabled();

    // Three links (the expired one counted) is the cap.
    await expect(canvas.getByRole('button', {
      name: 'Generate link'
    })).toBeDisabled();
    await expect(canvas.getByText(/You have 3 links, the maximum/)).toBeInTheDocument();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <CalendarLinksView {...args} isLoading />,
    Error: <CalendarLinksView {...args} isError />,
    Empty: <CalendarLinksView {...args} links={[]} />,
    'Copy refused': <CalendarLinksView {...args} links={[PHONE]} copyFailedId="l3" />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument();
    await expect(region('Loading').queryByRole('button', {
      name: 'Generate link'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByRole('alert')).toHaveTextContent("Couldn't load your calendar links");
    await expect(region('Error').queryByRole('button', {
      name: 'Generate link'
    })).not.toBeInTheDocument();
    await expect(region('Empty').getByText('No calendar links yet.')).toBeInTheDocument();
    await expect(region('Empty').getByRole('button', {
      name: 'Generate link'
    })).toBeEnabled();

    // The browser refused the clipboard write: say so, and put the URL where it can be copied by hand.
    const refused = region('Copy refused');
    await expect(refused.getByRole('alert')).toHaveTextContent("Couldn't copy automatically. Copy the link below.");
    await expect(refused.getByLabelText('Calendar link URL for My phone')).toHaveValue(PHONE.url);
    await expect(refused.getByRole('button', {
      name: 'Copy link'
    })).toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    'Below the cap': <CalendarLinksView {...args} links={[PHONE, UNLABELLED]} copiedId="l2" />,
    Error: <CalendarLinksView {...args} isError />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = within(canvas.getByRole('region', {
      name: 'Below the cap'
    }));
    const portal = within(document.body);

    // The copied feedback is per link: only the one the container says was copied reads "Copied!".
    await expect(within(region.getByRole('listitem', {
      name: 'Link from 14 mrt 2026'
    })).getByRole('button', {
      name: 'Copied!'
    })).toBeInTheDocument();
    const phone = within(region.getByRole('listitem', {
      name: 'My phone'
    }));
    await userEvent.click(phone.getByRole('button', {
      name: 'Copy link'
    }));
    await expect(args.onCopy).toHaveBeenCalledWith(PHONE);

    // Cancelling the confirmation deletes nothing.
    await userEvent.click(phone.getByRole('button', {
      name: 'Delete'
    }));
    await expect(await portal.findByText('Every calendar subscribed with this link stops updating.')).toBeInTheDocument();
    // A fixed title: one built from the target would go blank while the dialog animates out.
    await expect(portal.getByRole('heading', {
      name: 'Delete calendar link?'
    })).toBeInTheDocument();
    await userEvent.click(portal.getByRole('button', {
      name: 'Cancel'
    }));
    await expect(args.onDelete).not.toHaveBeenCalled();
    await userEvent.click(phone.getByRole('button', {
      name: 'Delete'
    }));
    await userEvent.click(await portal.findByRole('button', {
      name: 'Delete link'
    }));
    await expect(args.onDelete).toHaveBeenCalledWith('l3');

    // No label is sent as none, so the server falls back to the creation date.
    await userEvent.click(region.getByRole('button', {
      name: 'Generate link'
    }));
    await expect(args.onGenerate).toHaveBeenLastCalledWith(undefined);
    const label = region.getByLabelText('Label (optional)');
    await expect(label).toHaveAttribute('maxLength', '50');
    // Enter submits the form, like the button does.
    await userEvent.type(label, '  Work laptop {Enter}');
    await expect(args.onGenerate).toHaveBeenLastCalledWith('Work laptop');
    await expect(label).toHaveValue('');
    await userEvent.click(within(canvas.getByRole('region', {
      name: 'Error'
    })).getByRole('button', {
      name: 'Retry'
    }));
    await expect(args.onRetry).toHaveBeenCalled();
  }
}`,...R.parameters?.docs?.source}}},z=[`Data`,`Shells`,`Interactions`]})))()}B();export{I as Data,R as Interactions,L as Shells,z as __namedExportsOrder,F as default};