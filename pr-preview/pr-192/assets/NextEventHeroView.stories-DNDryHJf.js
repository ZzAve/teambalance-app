import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-BXyDCIBC.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o}from"./event-fixtures-BaYeuP-I.js";import{n as s,t as c}from"./check-D5G-a34T.js";import{i as l,n as u,r as d,t as f}from"./map-pin-Dx7G_h5H.js";import{n as p,t as m}from"./x-yFpOxtGS.js";function h(e,t){let n=(e instanceof Date?e:new Date(e)).getTime()-t.getTime();return n<=0?{value:`Now`,unit:`on`}:n>=v?{value:`${Math.floor(n/v)}d`,unit:`away`}:n>=_?{value:`${Math.floor(n/_)}h`,unit:`away`}:{value:`${Math.max(1,Math.floor(n/g))}m`,unit:`away`}}var g,_,v;function y(){return(y=e((()=>{g=6e4,_=60*g,v=24*_})))()}function b({event:e,myState:t,isSaving:n=!1,onRespond:i,now:a=new Date}){let o=new Date(e.startTime),s=h(e.startTime,a),l=t===`ATTENDING`,u=t===`ABSENT`;return(0,x.jsxs)(`section`,{"aria-label":`Next up`,className:`relative mt-4 overflow-hidden rounded-3xl p-4 text-white`,style:{background:`linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)`,boxShadow:`0 14px 34px rgba(34, 92, 156, 0.18)`},children:[(0,x.jsx)(`span`,{"aria-hidden":`true`,className:`pointer-events-none absolute -right-8 -top-10 h-[150px] w-[150px] rounded-full bg-white/15 blur-sm`}),(0,x.jsxs)(`div`,{className:`absolute right-4 top-4 z-10 text-right`,children:[(0,x.jsx)(`span`,{className:`font-display block text-[22px] font-extrabold leading-none`,children:s.value}),(0,x.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.08em] opacity-85`,children:s.unit})]}),(0,x.jsx)(`p`,{className:`pr-12 text-[11px] font-bold uppercase tracking-[0.14em] opacity-90`,children:`Next up`}),(0,x.jsx)(`h3`,{className:`font-display mb-1 mt-2 pr-12 text-[21px] font-extrabold leading-[1.08]`,children:(0,x.jsx)(r,{to:`/events/$eventId`,params:{eventId:e.id},className:`hover:underline`,children:e.title})}),(0,x.jsxs)(`p`,{className:`flex flex-wrap items-center gap-1.5 text-[13px] opacity-95`,children:[(0,x.jsx)(d,{size:13,className:`shrink-0`}),o.toLocaleDateString(`nl-NL`,{weekday:`short`,day:`numeric`,month:`short`}),` · `,o.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})]}),e.location&&(0,x.jsxs)(`p`,{className:`mt-1 flex flex-wrap items-center gap-1.5 text-[13px] opacity-95`,children:[(0,x.jsx)(f,{size:13,className:`shrink-0`}),e.location]}),(0,x.jsxs)(`p`,{className:`mt-2.5 text-[13px] opacity-90`,children:[e.attendanceSummary.attending,` going · `,S[t]]}),(0,x.jsxs)(`div`,{className:`mt-3.5 flex gap-2`,children:[(0,x.jsxs)(`button`,{"aria-pressed":l,disabled:n,onClick:()=>i(`ATTENDING`),style:u?void 0:{color:`var(--color-green-dark)`},className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,u?`bg-white/20 text-white`:`bg-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,x.jsx)(c,{size:16}),`I'm in`]}),(0,x.jsxs)(`button`,{"aria-pressed":u,disabled:n,onClick:()=>i(`ABSENT`),style:u?{color:`var(--color-red)`}:void 0,className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,u?`bg-white`:l?`bg-white/12 text-white`:`bg-white/20 text-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,x.jsx)(m,{size:16}),`Can't make it`]})]})]})}var x,S;function C(){return(C=e((()=>{t(),s(),l(),u(),p(),y(),x=a(),S={ATTENDING:`you're in`,ABSENT:`you're out`,MAYBE:`you said maybe`,NOT_RESPONDED:`you haven't replied`},b.__docgenInfo={description:`The Next Up hero: the most imminent event, big, with its countdown and an inline RSVP so the
commonest action on the page costs no navigation.

Prop-only, and mounted conditionally — the parent decides whether there is a hero at all
(\`selectHeroEvent\`), and drops the event from the list below so it never renders twice. There is
deliberately no empty state here: when nothing is near, the page has no hero, not a hero saying
nothing is near.`,methods:[],displayName:`NextEventHeroView`,props:{event:{required:!0,tsType:{name:`Event`},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:`The viewer's own response — drives the CTA styling and the status line.`},isSaving:{required:!1,tsType:{name:`boolean`},description:`An RSVP is in flight; both buttons are held until it settles.`,defaultValue:{value:`false`,computed:!1}},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:``},now:{required:!1,tsType:{name:`Date`},description:`Injected so the countdown is deterministic in stories; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}}}}})))()}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;function z(){return(z=e((()=>{i(),C(),{expect:w,fn:T}=__STORYBOOK_MODULE_TEST__,E=new Date(2026,7,10,9,0),D=o({id:`evt-hero`,eventType:{id:`et-2`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,startTime:new Date(2026,7,12,20,0).toISOString(),location:`Sporthal De Toekomst`,attendanceSummary:{attending:10,maybe:1,absent:0,notResponded:4,roleBreakdown:[]}}),O={title:`widgets/next-event-hero/NextEventHeroView`,component:b,decorators:[n],args:{event:D,now:E,myState:`NOT_RESPONDED`,onRespond:T()}},k={play:async({canvas:e})=>{await w(e.getByText(`Next up`)).toBeInTheDocument(),await w(e.getByText(`Training — Court 2`)).toBeInTheDocument(),await w(e.getByText(`Sporthal De Toekomst`)).toBeInTheDocument(),await w(e.getByText(`2d`)).toBeInTheDocument()}},A={play:async({canvas:e})=>{await w(e.getByText(/10 going · you haven't replied/)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await w(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},j={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await w(e.getByText(/10 going · you're in/)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`)}},M={args:{myState:`ABSENT`},play:async({canvas:e})=>{await w(e.getByText(/10 going · you're out/)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`true`)}},N={args:{myState:`MAYBE`},play:async({canvas:e})=>{await w(e.getByText(/10 going · you said maybe/)).toBeInTheDocument(),await w(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await w(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},P={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/I'm in/})),await w(n.onRespond).toHaveBeenCalledWith(`ATTENDING`)}},F={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Can't make it/})),await w(n.onRespond).toHaveBeenCalledWith(`ABSENT`)}},I={args:{isSaving:!0},play:async({canvas:e,userEvent:t,args:n})=>{await w(e.getByRole(`button`,{name:/I'm in/})).toBeDisabled(),await w(e.getByRole(`button`,{name:/Can't make it/})).toBeDisabled(),await t.click(e.getByRole(`button`,{name:/I'm in/})),await w(n.onRespond).not.toHaveBeenCalled()}},L={args:{event:o({...D,startTime:new Date(2026,7,10,20,0).toISOString()})},play:async({canvas:e})=>{await w(e.getByText(`11h`)).toBeInTheDocument()}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument();
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument();
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument();
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/10 going · you haven't replied/)).toBeInTheDocument();
    // Neither answer is pressed yet — "I'm in" is solid because it is the invitation.
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'false');
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/10 going · you're in/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'true');
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'ABSENT'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/10 going · you're out/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'true');
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    myState: 'MAYBE'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/10 going · you said maybe/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toHaveAttribute('aria-pressed', 'false');
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('ATTENDING');
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Can't make it/
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('ABSENT');
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    isSaving: true
  },
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    // Both answers are held while an RSVP is in flight, so a double-tap can't race the mutation.
    await expect(canvas.getByRole('button', {
      name: /I'm in/
    })).toBeDisabled();
    await expect(canvas.getByRole('button', {
      name: /Can't make it/
    })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', {
      name: /I'm in/
    }));
    await expect(args.onRespond).not.toHaveBeenCalled();
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      ...EVENT,
      startTime: new Date(2026, 7, 10, 20, 0).toISOString()
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('11h')).toBeInTheDocument();
  }
}`,...L.parameters?.docs?.source}}},R=[`HasNext`,`HaventReplied`,`Going`,`NotGoing`,`Maybe`,`RsvpIn`,`RsvpOut`,`Saving`,`StartingToday`]})))()}z();export{j as Going,k as HasNext,A as HaventReplied,N as Maybe,M as NotGoing,P as RsvpIn,F as RsvpOut,I as Saving,L as StartingToday,R as __namedExportsOrder,O as default};