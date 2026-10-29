import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-CQoHr3e8.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{n as a,t as o}from"./button-CmIclryv.js";import{n as s,t as c}from"./input-sRJkGrbS.js";import{n as l,t as u}from"./label-DePAi37o.js";import{n as d,t as f}from"./switch-CEzS34Up.js";function p(e){let t=e.trim();if(t===``)return;if(!y.test(t))return NaN;let n=Math.round(Number(t.replace(`,`,`.`))*100);return n>=1&&n<=v?n:NaN}function m(e){return e===void 0?``:(e/100).toFixed(2).replace(`.`,`,`)}function h(e){let t=e.trim();return t===``||b.test(t)?null:`Use a link like https://bunq.me/yourteam.`}function g(e){let t=e?.trim();if(t)return`https://bunq.me/${t.replace(/^(?:https?:\/\/)?bunq\.me\//i,``).replace(/\/$/,``)}`}function _(e,t){return e.enabled!==t.enabled||e.beerPrice!==t.beerPrice||g(e.bunqMeLink)!==g(t.bunqMeLink)}var v,y,b;function x(){return(x=e((()=>{v=1e4,y=/^\d+(?:[.,]\d{1,2})?$/,b=/^(?:https?:\/\/)?bunq\.me\/[A-Za-z0-9_-]+\/?$/i})))()}function S({settings:e,isLoading:t,isError:n,isSaving:r,saved:i,error:a,onSave:o}){return(0,T.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`h2`,{className:`font-display text-title font-bold`,children:`Money pool`}),(0,T.jsx)(`p`,{className:`mt-1 text-small text-muted-foreground`,children:`Show your team's shared pool, and what its balance buys in beers.`})]}),t&&(0,T.jsx)(`p`,{role:`status`,className:`text-small text-muted-foreground`,children:`Loading…`}),n&&(0,T.jsx)(`p`,{role:`alert`,className:E,children:`Couldn't load the money pool settings. Please try again.`}),e&&!t&&!n&&(0,T.jsx)(C,{settings:e,isSaving:r,saved:i,error:a,onSave:o})]})}function C({settings:e,isSaving:t,saved:n,error:r,onSave:i}){let a=(0,w.useId)(),s=`${a}-beer-price`,l=`${a}-bunq-me-link`,[d,g]=(0,w.useState)(e.enabled),[v,y]=(0,w.useState)(m(e.beerPrice)),[b,x]=(0,w.useState)(e.bunqMeLink??``),S=`${e.enabled}|${e.beerPrice}|${e.bunqMeLink}`,[C,O]=(0,w.useState)(S);C!==S&&(O(S),g(e.enabled),y(m(e.beerPrice)),x(e.bunqMeLink??``));let k=p(v),A=Number.isNaN(k)?`Enter a price between €0,01 and €100,00.`:null,j=h(b),M={enabled:d,beerPrice:k,bunqMeLink:b.trim()||void 0},N=_(e,M),P=!A&&!j&&N;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)(`div`,{className:`flex flex-col`,children:[(0,T.jsxs)(u,{className:`flex min-h-11 items-center justify-between gap-3 leading-normal`,children:[`Show the money pool to the team`,(0,T.jsx)(f,{checked:d,onCheckedChange:g,"aria-label":`Show the money pool to the team`})]}),(0,T.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`When switched off, the Money tab and page are hidden for everyone in the team.`})]}),(0,T.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,T.jsx)(u,{htmlFor:s,children:`Beer price (€)`}),(0,T.jsx)(c,{id:s,inputMode:`decimal`,value:v,placeholder:`2,70`,onChange:e=>y(e.target.value),"aria-invalid":!!A,"aria-describedby":A?`${s}-error`:void 0,className:`w-48`}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`p`,{className:`text-caption text-muted-foreground`,children:`Leave empty to hide the Beer Counter.`}),(0,T.jsx)(`div`,{"aria-live":`polite`,"aria-atomic":`true`,children:A&&(0,T.jsx)(`p`,{id:`${s}-error`,className:D,children:A})})]})]}),(0,T.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,T.jsx)(u,{htmlFor:l,children:`bunq.me link`}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(c,{id:l,inputMode:`url`,value:b,placeholder:`https://bunq.me/yourteam`,onChange:e=>x(e.target.value),"aria-invalid":!!j,"aria-describedby":j?`${l}-error`:void 0}),(0,T.jsx)(`div`,{"aria-live":`polite`,"aria-atomic":`true`,children:j&&(0,T.jsx)(`p`,{id:`${l}-error`,className:D,children:j})})]})]}),r&&(0,T.jsx)(`p`,{role:`alert`,className:E,children:r}),(0,T.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,T.jsx)(o,{disabled:t||!P,onClick:()=>i(M),children:t?`Saving…`:`Save money pool`}),(0,T.jsx)(`p`,{role:`status`,className:`text-small text-muted-foreground`,children:n&&!N?`Saved`:``})]})]})}var w,T,E,D;function O(){return(O=e((()=>{w=t(),a(),s(),l(),d(),x(),T=n(),E=`rounded-lg bg-card p-3 text-small text-red-ink`,D=`${E} mt-1`,S.__docgenInfo={description:`Presentational money pool settings — the complete section, heading and all: the on/off switch, the
Beer Counter price and the team's bunq.me link. Owns only local draft state; the query and
mutation live in the MoneySettings container. Loading and error shells are props-driven so every
state renders as a story without a network (ADR-0017).`,methods:[],displayName:`MoneySettingsView`,props:{settings:{required:!1,tsType:{name:`MoneyPoolSettings`},description:`The saved settings (the baseline the draft is compared against).`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The settings query is in flight — render the loading shell instead of the form.`},isError:{required:!1,tsType:{name:`boolean`},description:`The settings query failed — render the error shell instead of the form.`},isSaving:{required:!1,tsType:{name:`boolean`},description:``},saved:{required:!1,tsType:{name:`boolean`},description:`The last save went through — confirmed to the admin until the draft changes again.`},error:{required:!1,tsType:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},description:`Backend error surfaced from the container (e.g. a rejected save), shown inline.`},onSave:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(settings: MoneyPoolSettings) => void`,signature:{arguments:[{type:{name:`MoneyPoolSettings`},name:`settings`}],return:{name:`void`}}},description:``}}}})))()}function k(e){let[t,n]=(0,A.useState)(e.settings),[r,i]=(0,A.useState)(!1);return(0,j.jsx)(S,{...e,settings:t,saved:r,onSave:t=>{e.onSave(t),n({...t,bunqMeLink:`https://${t.bunqMeLink?.replace(/^https?:\/\//,``)}`}),i(!0)}})}var A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{A=t(),r(),O(),j=n(),{expect:M,fn:N,waitFor:P,within:F}=__STORYBOOK_MODULE_TEST__,I={title:`features/money-settings/MoneySettingsView`,component:S,args:{settings:{enabled:!0,beerPrice:270,bunqMeLink:`https://bunq.me/setpointvt`},onSave:N()}},L={play:async({canvas:e})=>{await M(e.getByRole(`switch`,{name:`Show the money pool to the team`})).toBeChecked(),await M(e.getByLabelText(`Beer price (€)`)).toHaveValue(`2,70`),await M(e.getByLabelText(`bunq.me link`)).toHaveValue(`https://bunq.me/setpointvt`),await M(e.getByRole(`button`,{name:`Save money pool`})).toBeDisabled()}},R={render:e=>(0,j.jsx)(i,{items:{Loading:(0,j.jsx)(S,{...e,settings:void 0,isLoading:!0}),Error:(0,j.jsx)(S,{...e,settings:void 0,isError:!0}),"Off without price":(0,j.jsx)(S,{...e,settings:{enabled:!1,beerPrice:void 0,bunqMeLink:void 0}}),"Save failed":(0,j.jsx)(S,{...e,error:`Could not save the money pool settings. Please try again.`}),Saving:(0,j.jsx)(S,{...e,isSaving:!0})}}),play:async({canvas:e})=>{let t=t=>F(e.getByRole(`region`,{name:t}));await M(t(`Loading`).getByRole(`status`)).toHaveTextContent(`Loading…`),await M(t(`Loading`).queryByRole(`button`,{name:`Save money pool`})).not.toBeInTheDocument(),await M(t(`Error`).getByRole(`alert`)).toHaveTextContent(`Couldn't load the money pool settings. Please try again.`),await M(t(`Error`).queryByRole(`button`,{name:`Save money pool`})).not.toBeInTheDocument(),await M(t(`Off without price`).getByRole(`switch`)).not.toBeChecked(),await M(t(`Off without price`).getByLabelText(`Beer price (€)`)).toHaveValue(``),await M(t(`Off without price`).getByRole(`button`,{name:`Save money pool`})).toBeDisabled(),await M(t(`Off without price`).getByText(/Money tab and page are hidden for everyone in the team/)).toBeInTheDocument(),await M(t(`Save failed`).getByRole(`alert`)).toHaveTextContent(`Could not save the money pool settings. Please try again.`),await M(t(`Save failed`).getByRole(`button`,{name:`Save money pool`})).toBeDisabled(),await M(t(`Saving`).getByRole(`button`,{name:`Saving…`})).toBeDisabled()}},z={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,j.jsx)(k,{...e}),play:async({canvas:e,canvasElement:t,userEvent:n,args:r})=>{let i=e.getByLabelText(`Beer price (€)`),a=e.getByLabelText(`bunq.me link`),o=e.getByRole(`button`,{name:`Save money pool`}),[s,c]=Array.from(t.querySelectorAll(`[aria-live="polite"]`));await M(t.querySelectorAll(`[aria-live="polite"]`)).toHaveLength(2),await M(s).toHaveAttribute(`aria-atomic`,`true`),await M(s).toBeEmptyDOMElement(),await M(c).toBeEmptyDOMElement(),await n.clear(i),await n.type(i,`0`),await P(()=>M(s).toHaveTextContent(`Enter a price between €0,01 and €100,00.`)),await P(()=>M(i).toHaveAccessibleDescription(`Enter a price between €0,01 and €100,00.`)),await M(i).toBeInvalid(),await M(e.queryByRole(`alert`)).not.toBeInTheDocument(),await M(o).toBeDisabled(),await n.clear(i),await n.type(i,`3,10`),await n.clear(a),await n.type(a,`https://evil.example/x`),await P(()=>M(c).toHaveTextContent(`Use a link like https://bunq.me/yourteam.`)),await M(s).toBeEmptyDOMElement(),await P(()=>M(a).toHaveAccessibleDescription(`Use a link like https://bunq.me/yourteam.`)),await M(a).toBeInvalid(),await M(e.queryByRole(`alert`)).not.toBeInTheDocument(),await M(i).toBeValid(),await M(o).toBeDisabled(),await n.clear(a),await n.type(a,`bunq.me/newteam`),await n.click(e.getByText(`Show the money pool to the team`)),await M(e.getByRole(`switch`,{name:`Show the money pool to the team`})).not.toBeChecked(),await M(o).toBeEnabled();let l=e.getByRole(`status`);await n.click(o),await M(r.onSave).toHaveBeenCalledWith({enabled:!1,beerPrice:310,bunqMeLink:`bunq.me/newteam`}),await M(e.getByRole(`button`,{name:`Save money pool`})).toBe(o),await M(e.getByRole(`status`)).toBe(l),await M(e.getByLabelText(`bunq.me link`)).toHaveValue(`https://bunq.me/newteam`),await M(e.getByRole(`status`)).toHaveTextContent(`Saved`),await M(e.getByRole(`button`,{name:`Save money pool`})).toBeDisabled()}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole('switch', {
      name: 'Show the money pool to the team'
    })).toBeChecked();
    await expect(canvas.getByLabelText('Beer price (€)')).toHaveValue('2,70');
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/setpointvt');
    await expect(canvas.getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    Loading: <MoneySettingsView {...args} settings={undefined} isLoading />,
    Error: <MoneySettingsView {...args} settings={undefined} isError />,
    'Off without price': <MoneySettingsView {...args} settings={{
      enabled: false,
      beerPrice: undefined,
      bunqMeLink: undefined
    }} />,
    'Save failed': <MoneySettingsView {...args} error="Could not save the money pool settings. Please try again." />,
    Saving: <MoneySettingsView {...args} isSaving />
  }} />,
  play: async ({
    canvas
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Loading').getByRole('status')).toHaveTextContent('Loading…');
    await expect(region('Loading').queryByRole('button', {
      name: 'Save money pool'
    })).not.toBeInTheDocument();
    await expect(region('Error').getByRole('alert')).toHaveTextContent("Couldn't load the money pool settings. Please try again.");
    await expect(region('Error').queryByRole('button', {
      name: 'Save money pool'
    })).not.toBeInTheDocument();
    await expect(region('Off without price').getByRole('switch')).not.toBeChecked();
    await expect(region('Off without price').getByLabelText('Beer price (€)')).toHaveValue('');
    await expect(region('Off without price').getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
    await expect(region('Off without price').getByText(/Money tab and page are hidden for everyone in the team/)).toBeInTheDocument();
    await expect(region('Save failed').getByRole('alert')).toHaveTextContent('Could not save the money pool settings. Please try again.');
    await expect(region('Save failed').getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
    await expect(region('Saving').getByRole('button', {
      name: 'Saving…'
    })).toBeDisabled();
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <SaveRoundTrip {...args} />,
  play: async ({
    canvas,
    canvasElement,
    userEvent,
    args
  }) => {
    const price = canvas.getByLabelText('Beer price (€)');
    const link = canvas.getByLabelText('bunq.me link');
    const save = canvas.getByRole('button', {
      name: 'Save money pool'
    });

    // Each field has a polite live region that is mounted from the start and empty until it has an
    // error, so the error is announced when it appears (a region added together with its text is not).
    const [priceErrors, linkErrors] = Array.from(canvasElement.querySelectorAll('[aria-live="polite"]'));
    await expect(canvasElement.querySelectorAll('[aria-live="polite"]')).toHaveLength(2);
    await expect(priceErrors).toHaveAttribute('aria-atomic', 'true');
    await expect(priceErrors).toBeEmptyDOMElement();
    await expect(linkErrors).toBeEmptyDOMElement();
    await userEvent.clear(price);
    await userEvent.type(price, '0');
    await waitFor(() => expect(priceErrors).toHaveTextContent('Enter a price between €0,01 and €100,00.'));
    await waitFor(() => expect(price).toHaveAccessibleDescription('Enter a price between €0,01 and €100,00.'));
    await expect(price).toBeInvalid();
    // Field errors are read through the field, not announced assertively while the admin is still typing.
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(save).toBeDisabled();
    await userEvent.clear(price);
    await userEvent.type(price, '3,10');
    await userEvent.clear(link);
    await userEvent.type(link, 'https://evil.example/x');
    await waitFor(() => expect(linkErrors).toHaveTextContent('Use a link like https://bunq.me/yourteam.'));
    await expect(priceErrors).toBeEmptyDOMElement();
    await waitFor(() => expect(link).toHaveAccessibleDescription('Use a link like https://bunq.me/yourteam.'));
    await expect(link).toBeInvalid();
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(price).toBeValid();
    await expect(save).toBeDisabled();
    await userEvent.clear(link);
    await userEvent.type(link, 'bunq.me/newteam');
    // The visible text is the switch's label: tapping it toggles the switch.
    await userEvent.click(canvas.getByText('Show the money pool to the team'));
    await expect(canvas.getByRole('switch', {
      name: 'Show the money pool to the team'
    })).not.toBeChecked();
    await expect(save).toBeEnabled();
    const status = canvas.getByRole('status');
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalledWith({
      enabled: false,
      beerPrice: 310,
      bunqMeLink: 'bunq.me/newteam'
    });

    // Only the draft starts over: the Save button and the status region stay the same nodes, so "Saved"
    // is announced. Not asserted: keyboard focus. A focused button that becomes disabled (saving starts)
    // drops focus to <body> in Chromium, which this harness never does because it does not disable it.
    await expect(canvas.getByRole('button', {
      name: 'Save money pool'
    })).toBe(save);
    await expect(canvas.getByRole('status')).toBe(status);

    // The saved settings come back normalised: the form starts over from them instead of keeping the draft.
    await expect(canvas.getByLabelText('bunq.me link')).toHaveValue('https://bunq.me/newteam');
    await expect(canvas.getByRole('status')).toHaveTextContent('Saved');
    await expect(canvas.getByRole('button', {
      name: 'Save money pool'
    })).toBeDisabled();
  }
}`,...z.parameters?.docs?.source}}},B=[`Data`,`Shells`,`Interactions`]})))()}V();export{L as Data,z as Interactions,R as Shells,B as __namedExportsOrder,I as default};