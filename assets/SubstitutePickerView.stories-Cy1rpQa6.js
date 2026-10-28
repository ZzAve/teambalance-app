import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BBRdzbA7.js";import{n,t as r}from"./utils-BTemNN_S.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{c as a,r as o}from"./event-fixtures-D7dsmgD6.js";import{n as s,t as c}from"./plus-CHfOAwoW.js";import{n as l,t as u}from"./button-AKCGabB4.js";import{n as d,t as f}from"./input-3lYKSvQ8.js";import{n as p,t as m}from"./label-CDDErRaF.js";import{i as h,n as g}from"./auth-DVT_MwnE.js";import{n as _}from"./wirespec-client-B5qV6AxX.js";import{a as v,i as y,n as ee,r as te,s as b,t as x}from"./sheet-0lQXD5xt.js";import{n as S,t as C}from"./SubstituteAvatar-3znNUJlt.js";import{i as w,r as T}from"./lineup-ClpUuphK.js";import{i as E,n as D,t as O}from"./SubstitutesBlock-DOk2KhbB.js";var k;function A(){return(A=e((()=>{h(),_(),g(),k=class extends Error{constructor(e){super(e),this.name=`SubstituteError`}}})))()}function j(e,t){return{plays:e.filter(e=>e.position?.id===t),others:e.filter(e=>e.position?.id!==t)}}function M({open:e,eventTitle:t,position:n=null,positions:i,substitutes:a,isLoading:o=!1,isError:s=!1,onRetry:l,positionsError:d=!1,onRetryPositions:p,pending:h=!1,onEvent:g,onSetState:_,onCreate:b,onClose:S}){let[w,E]=(0,F.useState)(!1),[A,j]=(0,F.useState)(``),[M,R]=(0,F.useState)(null),[z,B]=(0,F.useState)(!1),[V,H]=(0,F.useState)(null),U=(0,F.useRef)(0),W=A.trim(),G=a.find(e=>e.name.toLowerCase()===W.toLowerCase()),K=G?`${G.name} is already on the list — find them above.`:V,q=e=>{let t=g.find(t=>t.substituteId===e.id)?.state;return(0,I.jsxs)(`div`,{role:`group`,"aria-label":e.name,className:`flex items-center gap-3 border-b border-border/40 px-3 py-2 last:border-b-0`,children:[(0,I.jsx)(C,{name:e.name}),(0,I.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,I.jsx)(`span`,{className:`block truncate text-small font-medium`,children:e.name}),(0,I.jsx)(`span`,{className:`block text-caption text-muted-foreground`,children:e.position?.label??`Unassigned`})]}),(0,I.jsx)(`span`,{className:`flex shrink-0 items-center gap-1`,children:O.map(n=>(0,I.jsx)(`button`,{type:`button`,"aria-pressed":t===n.value,disabled:h,onClick:()=>_(e.id,n.value),className:r(D,t===n.value?n.active:`border-border text-muted-foreground hover:bg-muted`),children:n.label},n.value))})]},e.id)},J=()=>{U.current++,E(!1),j(``),H(null),B(!1)},Y=()=>{J(),S()},X=async()=>{let e=++U.current;B(!0),H(null);try{await b(W,M),e===U.current&&J()}catch(t){if(e!==U.current)return;H(t instanceof k?t.message:`Couldn't add the substitute — please try again.`),B(!1)}};return(0,I.jsx)(x,{open:e,onOpenChange:e=>!e&&Y(),children:(0,I.jsxs)(ee,{children:[(0,I.jsxs)(y,{children:[(0,I.jsx)(v,{children:n?T(n.label):`Call in substitutes`}),(0,I.jsx)(te,{children:t})]}),a.length===0?s?(0,I.jsx)(N,{className:`mb-3`,message:`Couldn't load the list.`,onRetry:l}):(0,I.jsx)(`p`,{className:`mb-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 text-small text-muted-foreground`,children:o?`Loading the list…`:`Nobody on the list yet.`}):n?(0,I.jsx)(P,{position:n,substitutes:a,renderRow:q}):(0,I.jsx)(`div`,{className:L,children:a.map(q)}),w?(0,I.jsxs)(`div`,{className:`flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card p-3`,children:[(0,I.jsx)(m,{htmlFor:`new-substitute-name`,children:`Name`}),(0,I.jsx)(f,{id:`new-substitute-name`,value:A,maxLength:100,autoComplete:`off`,placeholder:`e.g. Pieter Smit`,onChange:e=>{j(e.target.value),H(null)},"aria-invalid":K!==null}),K&&(0,I.jsx)(`p`,{role:`alert`,className:`text-small text-red-ink`,children:K}),(0,I.jsxs)(`span`,{className:`text-small font-medium`,children:[`Position `,(0,I.jsx)(`span`,{className:`font-normal text-muted-foreground`,children:`(optional)`})]}),(0,I.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:[...i,{id:null,label:`None`}].map(e=>(0,I.jsx)(`button`,{type:`button`,"aria-pressed":M===e.id,onClick:()=>R(e.id),className:r(`min-h-11 rounded-full border px-3 text-small focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,M===e.id?`border-purple bg-purple text-white`:`border-border bg-background`),children:e.label},e.id??`none`))}),d&&(0,I.jsx)(N,{message:`Couldn't load the positions.`,onRetry:p}),(0,I.jsx)(u,{type:`button`,disabled:!W||G!==void 0||z,onClick:X,children:z?`Adding…`:`Add as Maybe`})]}):(0,I.jsxs)(`button`,{type:`button`,onClick:()=>{R(n?.id??null),E(!0)},className:`flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-purple bg-card px-3 py-2.5 text-left font-semibold text-purple-ink`,children:[(0,I.jsx)(`span`,{className:`grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-purple`,children:(0,I.jsx)(c,{size:16})}),(0,I.jsxs)(`span`,{children:[`New substitute`,(0,I.jsx)(`span`,{className:`block text-caption font-normal text-muted-foreground`,children:`Someone who isn't on the list yet`})]})]}),(0,I.jsx)(u,{type:`button`,variant:`outline`,className:`mt-4`,onClick:Y,children:`Done`})]})})}function N({message:e,onRetry:t,className:n}){return(0,I.jsxs)(`p`,{role:`alert`,className:r(`flex items-center justify-between gap-3 rounded-lg bg-red/10 px-3 py-2 text-small text-red-ink`,n),children:[e,(0,I.jsx)(u,{type:`button`,variant:`outline`,size:`sm`,onClick:t,children:`Try again`})]})}function P({position:e,substitutes:t,renderRow:n}){let{plays:r,others:i}=j(t,e.id),a=`Plays ${e.label}`;return(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(`div`,{role:`group`,"aria-label":a,children:[(0,I.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:a}),(0,I.jsx)(`div`,{className:L,children:r.length===0?(0,I.jsx)(`p`,{className:`px-3 py-2.5 text-small text-muted-foreground`,children:`Nobody on the list plays this yet.`}):r.map(n)})]}),i.length>0&&(0,I.jsxs)(`div`,{role:`group`,"aria-label":`Others`,children:[(0,I.jsx)(`h3`,{className:`mb-1.5 text-caption font-semibold text-muted-foreground`,children:`Others`}),(0,I.jsx)(`div`,{className:L,children:i.map(n)})]})]})}var F,I,L;function R(){return(R=e((()=>{F=t(),s(),A(),l(),d(),p(),b(),n(),S(),w(),E(),I=i(),L=`mb-3 overflow-hidden rounded-lg border border-border/60 bg-card`,M.__docgenInfo={description:`Calling Substitutes in for one event (ADR-0033). Lists the Team's Substitutes, each with inline
Going / Maybe / Can't, so several can be called in, and a "no" recorded, before Done. Can't keeps
the person on the event as declined; taking them off the event is not offered here, only in their
Substitute sheet, so recording a "no" can never delete that they were asked.

Any Member may also add someone who is not on the list yet: a name and an optional Position, added
as Maybe, since the person has been asked and not yet answered. Prop-only; the writes live
in [SubstitutePicker].`,methods:[],displayName:`SubstitutePickerView`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},eventTitle:{required:!0,tsType:{name:`string`},description:``},position:{required:!1,tsType:{name:`union`,raw:`PositionRef | null`,elements:[{name:`PositionRef`},{name:`null`}]},description:`Opened from one Position's open spot: who plays it comes first, and a new one plays it too.`,defaultValue:{value:`null`,computed:!1}},positions:{required:!0,tsType:{name:`Array`,elements:[{name:`PositionRef`}],raw:`PositionRef[]`},description:``},substitutes:{required:!0,tsType:{name:`Array`,elements:[{name:`Substitute`}],raw:`Substitute[]`},description:`The Team's list, ordered by name.`},isLoading:{required:!1,tsType:{name:`boolean`},description:`The list is still loading: say so, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},isError:{required:!1,tsType:{name:`boolean`},description:`The list could not be loaded: say so, with a retry, rather than claiming nobody is on it.`,defaultValue:{value:`false`,computed:!1}},onRetry:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},positionsError:{required:!1,tsType:{name:`boolean`},description:`The Positions could not be loaded: the form says so, with a retry, instead of offering only None.`,defaultValue:{value:`false`,computed:!1}},onRetryPositions:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},pending:{required:!1,tsType:{name:`boolean`},description:`A Substitute write is in flight; the state buttons are held.`,defaultValue:{value:`false`,computed:!1}},onEvent:{required:!0,tsType:{name:`Array`,elements:[{name:`SubstituteEntry`}],raw:`SubstituteEntry[]`},description:`The Substitutes already on this event, with their state.`},onSetState:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(substituteId: string, state: SubstituteState) => void`,signature:{arguments:[{type:{name:`string`},name:`substituteId`},{type:{name:`SubstituteEntry['state']`,raw:`SubstituteEntry['state']`},name:`state`}],return:{name:`void`}}},description:``},onCreate:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(name: string, positionId: string | null) => Promise<unknown>`,signature:{arguments:[{type:{name:`string`},name:`name`},{type:{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]},name:`positionId`}],return:{name:`Promise`,elements:[{name:`unknown`}],raw:`Promise<unknown>`}}},description:`Creates a Substitute and adds them to the event as Maybe (asked, not confirmed). Resolves once
they are on the list; a rejection keeps the form open with the name, and a [SubstituteError]'s
message is shown as is.`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{z=t(),A(),o(),R(),B=i(),{expect:V,fn:H,within:U}=__STORYBOOK_MODULE_TEST__,W=[{id:`pos-setter`,label:`Setter`},{id:`pos-libero`,label:`Libero`}],G={id:`pos-libero`,label:`Libero`},K=[{id:`sub-1`,name:`Jan de Vries`,position:G,shirtNumber:void 0},{id:`sub-2`,name:`Mila Jansen`,position:void 0,shirtNumber:void 0},{id:`sub-3`,name:`Kees Bakker`,position:{id:`pos-setter`,label:`Setter`},shirtNumber:void 0},{id:`sub-4`,name:`Pieter Smit`,position:{id:`pos-setter`,label:`Setter`},shirtNumber:void 0}],q=[a(`sub-1`,`Jan de Vries`,{position:G}),a(`sub-2`,`Mila Jansen`,{state:`MAYBE`}),a(`sub-4`,`Pieter Smit`,{state:`ABSENT`})],J={title:`features/call-in-substitutes/SubstitutePickerView`,component:M,args:{open:!0,eventTitle:`League Match vs Smash United`,positions:W,substitutes:K,onEvent:q,onSetState:H(),onCreate:H(),onClose:H(),onRetry:H(),onRetryPositions:H()}},Y={args:{position:G},play:async()=>{let e=U(await U(document.body).findByRole(`dialog`,{name:`Find a Libero`})),t=U(e.getByRole(`group`,{name:`Plays Libero`}));await V(t.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Jan de Vries`]);let n=U(e.getByRole(`group`,{name:`Others`}));await V(n.getAllByRole(`group`).map(e=>e.getAttribute(`aria-label`))).toEqual([`Mila Jansen`,`Kees Bakker`,`Pieter Smit`]);let r=U(e.getByRole(`group`,{name:`Jan de Vries`}));await V(r.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`true`),await V(r.getByText(`Libero`)).toBeInTheDocument();let i=U(e.getByRole(`group`,{name:`Mila Jansen`}));await V(i.getByRole(`button`,{name:`Maybe`})).toHaveAttribute(`aria-pressed`,`true`);let a=U(e.getByRole(`group`,{name:`Pieter Smit`}));await V(a.getByRole(`button`,{name:`Can't`})).toHaveAttribute(`aria-pressed`,`true`);let o=U(e.getByRole(`group`,{name:`Kees Bakker`}));await V(o.getByRole(`button`,{name:`Going`})).toHaveAttribute(`aria-pressed`,`false`),await V(e.queryByRole(`button`,{name:/take off/i})).not.toBeInTheDocument()}},X={args:{substitutes:[],onEvent:[],positions:[],positionsError:!0},render:function(e){let[t,n]=(0,z.useState)(!1);return(0,B.jsx)(M,{...e,isError:!t,isLoading:t,onRetry:()=>{e.onRetry?.(),n(!0)}})},play:async({userEvent:e,args:t})=>{let n=U(await U(document.body).findByRole(`dialog`,{name:`Call in substitutes`}));await V(n.getByRole(`alert`)).toHaveTextContent(`Couldn't load the list.`),await V(n.queryByText(`Nobody on the list yet.`)).not.toBeInTheDocument(),await V(n.queryByRole(`group`,{name:`Others`})).not.toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:`Try again`})),await V(t.onRetry).toHaveBeenCalled(),await V(await n.findByText(`Loading the list…`)).toBeInTheDocument(),await V(n.queryByText(`Nobody on the list yet.`)).not.toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await V(n.getByLabelText(`Name`)).toBeInTheDocument(),await V(n.getByRole(`button`,{name:`None`})).toHaveAttribute(`aria-pressed`,`true`),await V(n.queryByRole(`button`,{name:`Setter`})).not.toBeInTheDocument(),await V(n.getByRole(`alert`)).toHaveTextContent(`Couldn't load the positions.`),await e.click(n.getByRole(`button`,{name:`Try again`})),await V(t.onRetryPositions).toHaveBeenCalled(),await V(n.getByRole(`button`,{name:`Add as Maybe`})).toBeDisabled()}},Z={args:{position:G,isError:!0},parameters:{chromatic:{disableSnapshot:!0}},play:async({userEvent:e,args:t})=>{let n=U(await U(document.body).findByRole(`dialog`,{name:`Find a Libero`}));await V(n.getByRole(`group`,{name:`Plays Libero`})).toBeInTheDocument(),await V(n.queryByRole(`alert`)).not.toBeInTheDocument(),await e.click(U(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Going`})),await V(t.onSetState).toHaveBeenCalledWith(`sub-3`,`ATTENDING`),await e.click(U(n.getByRole(`group`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Maybe`})),await V(t.onSetState).toHaveBeenCalledWith(`sub-1`,`MAYBE`),await e.click(U(n.getByRole(`group`,{name:`Mila Jansen`})).getByRole(`button`,{name:`Can't`})),await V(t.onSetState).toHaveBeenCalledWith(`sub-2`,`ABSENT`);let r=U(n.getByRole(`group`,{name:`Kees Bakker`})).getByRole(`button`,{name:`Maybe`}),i=r.getBoundingClientRect(),a=(44-i.height)/2-1;for(let e of[i.top-a,i.bottom+a])await V(document.elementFromPoint(i.left+i.width/2,e)).toBe(r);await e.click(n.getByRole(`button`,{name:/New substitute/}));let o=n.getByRole(`button`,{name:`Add as Maybe`});await V(o).toBeDisabled(),await V(n.getByRole(`button`,{name:`Libero`})).toHaveAttribute(`aria-pressed`,`true`);for(let e of[`Setter`,`Libero`,`None`]){let t=n.getByRole(`button`,{name:e});t.scrollIntoView({block:`center`});let r=t.getBoundingClientRect();await V(r.height).toBeGreaterThanOrEqual(44);for(let e of[r.top+1,r.bottom-1])await V(document.elementFromPoint(r.left+r.width/2,e)).toBe(t)}await e.type(n.getByLabelText(`Name`),`Anouk de Boer`),await e.click(o),await V(t.onCreate).toHaveBeenCalledWith(`Anouk de Boer`,`pos-libero`),await V(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`None`})),await e.click(n.getByRole(`button`,{name:`Add as Maybe`})),await V(t.onCreate).toHaveBeenCalledWith(`Sanne Vos`,null),await V(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),` kees BAKKER `),await V(n.getByRole(`alert`)).toHaveTextContent(`Kees Bakker is already on the list — find them above.`),await V(n.getByRole(`button`,{name:`Add as Maybe`})).toBeDisabled(),await e.type(n.getByLabelText(`Name`),`jr`),await V(n.queryByRole(`alert`)).not.toBeInTheDocument(),await V(t.onCreate).not.toHaveBeenCalledWith(V.stringMatching(/kees/i),V.anything()),t.onCreate.mockRejectedValueOnce(new k(`Kees Bakker jr is already on the list.`)),await e.click(n.getByRole(`button`,{name:`Add as Maybe`})),await V(t.onCreate).toHaveBeenCalledWith(`kees BAKKER jr`,`pos-libero`),await V(await n.findByRole(`alert`)).toHaveTextContent(`Kees Bakker jr is already on the list.`),await V(n.getByLabelText(`Name`)).toHaveValue(` kees BAKKER jr`),t.onCreate.mockRejectedValueOnce(Error(`offline`)),await e.click(n.getByRole(`button`,{name:`Add as Maybe`})),await V(await n.findByRole(`alert`)).toHaveTextContent(`Couldn't add the substitute — please try again.`),await V(n.getByLabelText(`Name`)).toHaveValue(` kees BAKKER jr`),await e.click(n.getByRole(`button`,{name:`Add as Maybe`})),await V(await n.findByRole(`button`,{name:/New substitute/})).toBeInTheDocument(),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Half`),await e.click(n.getByRole(`button`,{name:`Done`})),await V(t.onClose).toHaveBeenCalled(),await V(n.queryByLabelText(`Name`)).not.toBeInTheDocument();let s=()=>{};t.onCreate.mockReturnValueOnce(new Promise(e=>s=e)),await e.click(n.getByRole(`button`,{name:/New substitute/})),await V(n.getByLabelText(`Name`)).toHaveValue(``),await e.type(n.getByLabelText(`Name`),`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`Add as Maybe`})),await V(await n.findByRole(`button`,{name:`Adding…`})).toBeDisabled(),await V(n.getByLabelText(`Name`)).toHaveValue(`Sanne Vos`),await e.click(n.getByRole(`button`,{name:`Done`})),await e.click(n.getByRole(`button`,{name:/New substitute/})),await e.type(n.getByLabelText(`Name`),`Bram Visser`),await V(n.getByRole(`button`,{name:`Add as Maybe`})).toBeEnabled(),s(),await new Promise(e=>setTimeout(e,0)),await V(n.getByLabelText(`Name`)).toHaveValue(`Bram Visser`)}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO
  },
  play: async () => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Find a Libero'
    }));
    // Who plays the Position comes first, the rest after (#359 decision 9).
    const plays = within(sheet.getByRole('group', {
      name: 'Plays Libero'
    }));
    await expect(plays.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Jan de Vries']);
    const others = within(sheet.getByRole('group', {
      name: 'Others'
    }));
    await expect(others.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Mila Jansen', 'Kees Bakker', 'Pieter Smit']);
    const jan = within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    }));
    await expect(jan.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(jan.getByText('Libero')).toBeInTheDocument();
    const mila = within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    }));
    await expect(mila.getByRole('button', {
      name: 'Maybe'
    })).toHaveAttribute('aria-pressed', 'true');
    // Asked and said no: kept on the event as declined, not deleted.
    const pieter = within(sheet.getByRole('group', {
      name: 'Pieter Smit'
    }));
    await expect(pieter.getByRole('button', {
      name: "Can't"
    })).toHaveAttribute('aria-pressed', 'true');
    // Not on this event yet: nothing pressed.
    const kees = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    }));
    await expect(kees.getByRole('button', {
      name: 'Going'
    })).toHaveAttribute('aria-pressed', 'false');
    // Deleting someone from the event is not a picker action; it lives in their sheet on the page.
    await expect(sheet.queryByRole('button', {
      name: /take off/i
    })).not.toBeInTheDocument();
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    substitutes: [],
    onEvent: [],
    positions: [],
    positionsError: true
  },
  render: function Render(args) {
    const [retried, setRetried] = useState(false);
    return <SubstitutePickerView {...args} isError={!retried} isLoading={retried} onRetry={() => {
      args.onRetry?.();
      setRetried(true);
    }} />;
  },
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Call in substitutes'
    }));
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the list.");
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument();
    await expect(sheet.queryByRole('group', {
      name: 'Others'
    })).not.toBeInTheDocument();
    await userEvent.click(sheet.getByRole('button', {
      name: 'Try again'
    }));
    await expect(args.onRetry).toHaveBeenCalled();
    await expect(await sheet.findByText('Loading the list…')).toBeInTheDocument();
    await expect(sheet.queryByText('Nobody on the list yet.')).not.toBeInTheDocument();

    // Opened without a Position, so none is chosen yet; the Positions failed to load, so None is the
    // only chip, next to its own Try again.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await expect(sheet.getByLabelText('Name')).toBeInTheDocument();
    await expect(sheet.getByRole('button', {
      name: 'None'
    })).toHaveAttribute('aria-pressed', 'true');
    await expect(sheet.queryByRole('button', {
      name: 'Setter'
    })).not.toBeInTheDocument();
    await expect(sheet.getByRole('alert')).toHaveTextContent("Couldn't load the positions.");
    await userEvent.click(sheet.getByRole('button', {
      name: 'Try again'
    }));
    await expect(args.onRetryPositions).toHaveBeenCalled();
    await expect(sheet.getByRole('button', {
      name: 'Add as Maybe'
    })).toBeDisabled();
  }
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    position: LIBERO,
    isError: true
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    userEvent,
    args
  }) => {
    const sheet = within(await within(document.body).findByRole('dialog', {
      name: 'Find a Libero'
    }));
    await expect(sheet.getByRole('group', {
      name: 'Plays Libero'
    })).toBeInTheDocument();
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument();

    // Several people can be called in before Done: one confirmed, one only asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-3', 'ATTENDING');
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Maybe'
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-1', 'MAYBE');
    // Mila answered no: recorded as declined, so the team still sees she was asked.
    await userEvent.click(within(sheet.getByRole('group', {
      name: 'Mila Jansen'
    })).getByRole('button', {
      name: "Can't"
    }));
    await expect(args.onSetState).toHaveBeenCalledWith('sub-2', 'ABSENT');

    // The pill stays small, but a tap anywhere in a 44px band around it lands on it (F7).
    const pill = within(sheet.getByRole('group', {
      name: 'Kees Bakker'
    })).getByRole('button', {
      name: 'Maybe'
    });
    const box = pill.getBoundingClientRect();
    const reach = (44 - box.height) / 2 - 1;
    for (const y of [box.top - reach, box.bottom + reach]) {
      await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(pill);
    }

    // Someone not on the list yet: a name and an optional Position, added as Maybe. Opened for
    // Libero, so Libero is already chosen.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    const add = sheet.getByRole('button', {
      name: 'Add as Maybe'
    });
    await expect(add).toBeDisabled();
    await expect(sheet.getByRole('button', {
      name: 'Libero'
    })).toHaveAttribute('aria-pressed', 'true');
    // A Position chip is a full 44px target itself: the chip is the box, no band around it (#388).
    for (const label of ['Setter', 'Libero', 'None']) {
      const chip = sheet.getByRole('button', {
        name: label
      });
      chip.scrollIntoView({
        block: 'center'
      });
      const box = chip.getBoundingClientRect();
      await expect(box.height).toBeGreaterThanOrEqual(44);
      for (const y of [box.top + 1, box.bottom - 1]) {
        await expect(document.elementFromPoint(box.left + box.width / 2, y)).toBe(chip);
      }
    }
    await userEvent.type(sheet.getByLabelText('Name'), 'Anouk de Boer');
    await userEvent.click(add);
    await expect(args.onCreate).toHaveBeenCalledWith('Anouk de Boer', 'pos-libero');
    // Added: the form closes and the picker stays open for the next one.
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // The form starts from the Position again; None is a choice.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos');
    await userEvent.click(sheet.getByRole('button', {
      name: 'None'
    }));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as Maybe'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('Sanne Vos', null);
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // Someone already on the list, in another case: caught before any request, with a pointer to
    // where they are (#389). The hint goes once the name differs.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), ' kees BAKKER ');
    await expect(sheet.getByRole('alert')).toHaveTextContent('Kees Bakker is already on the list — find them above.');
    await expect(sheet.getByRole('button', {
      name: 'Add as Maybe'
    })).toBeDisabled();
    await userEvent.type(sheet.getByLabelText('Name'), 'jr');
    await expect(sheet.queryByRole('alert')).not.toBeInTheDocument();
    await expect(args.onCreate).not.toHaveBeenCalledWith(expect.stringMatching(/kees/i), expect.anything());

    // The request is refused (someone else added them meanwhile), then fails outright: each time the
    // form stays open with the name, and says why under the field (#389).
    args.onCreate.mockRejectedValueOnce(new SubstituteError('Kees Bakker jr is already on the list.'));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as Maybe'
    }));
    await expect(args.onCreate).toHaveBeenCalledWith('kees BAKKER jr', 'pos-libero');
    await expect(await sheet.findByRole('alert')).toHaveTextContent('Kees Bakker jr is already on the list.');
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr');
    args.onCreate.mockRejectedValueOnce(new Error('offline'));
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as Maybe'
    }));
    await expect(await sheet.findByRole('alert')).toHaveTextContent("Couldn't add the substitute — please try again.");
    await expect(sheet.getByLabelText('Name')).toHaveValue(' kees BAKKER jr');
    // Third time lucky: the same name goes through and the form closes.
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as Maybe'
    }));
    await expect(await sheet.findByRole('button', {
      name: /New substitute/
    })).toBeInTheDocument();

    // Closing drops a half-typed name, so the next open starts fresh.
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Half');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await expect(args.onClose).toHaveBeenCalled();
    await expect(sheet.queryByLabelText('Name')).not.toBeInTheDocument();

    // While the request is out, the button says so and holds, and the name stays put.
    let settle = () => {};
    args.onCreate.mockReturnValueOnce(new Promise<void>(resolve => settle = resolve));
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await expect(sheet.getByLabelText('Name')).toHaveValue('');
    await userEvent.type(sheet.getByLabelText('Name'), 'Sanne Vos');
    await userEvent.click(sheet.getByRole('button', {
      name: 'Add as Maybe'
    }));
    await expect(await sheet.findByRole('button', {
      name: 'Adding…'
    })).toBeDisabled();
    await expect(sheet.getByLabelText('Name')).toHaveValue('Sanne Vos');

    // Closed and reopened while that request is still out: the fresh form is not held by it, and
    // its settling later leaves the fresh form alone.
    await userEvent.click(sheet.getByRole('button', {
      name: 'Done'
    }));
    await userEvent.click(sheet.getByRole('button', {
      name: /New substitute/
    }));
    await userEvent.type(sheet.getByLabelText('Name'), 'Bram Visser');
    await expect(sheet.getByRole('button', {
      name: 'Add as Maybe'
    })).toBeEnabled();
    settle();
    await new Promise(resolve => setTimeout(resolve, 0));
    await expect(sheet.getByLabelText('Name')).toHaveValue('Bram Visser');
  }
}`,...Z.parameters?.docs?.source}}},Q=[`Data`,`Shells`,`Interactions`]})))()}$();export{Y as Data,Z as Interactions,X as Shells,Q as __namedExportsOrder,J as default};