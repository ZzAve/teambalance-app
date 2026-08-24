import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-CzDymFKp.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{i as o,t as s}from"./team-routes-D-CcB4D7.js";import{n as c}from"./event-fixtures-BaYeuP-I.js";import{n as l,t as u}from"./check-Uryga-nM.js";import{i as d,n as f,r as p,t as m}from"./map-pin-CnaRa9N2.js";import{n as h,t as g}from"./x-Of1qqhwr.js";function _(e,t){let n=(e instanceof Date?e:new Date(e)).getTime()-t.getTime();return n<=0?{value:`Now`,unit:`on`}:n>=b?{value:`${Math.floor(n/b)}d`,unit:`away`}:n>=y?{value:`${Math.floor(n/y)}h`,unit:`away`}:{value:`${Math.max(1,Math.floor(n/v))}m`,unit:`away`}}var v,y,b;function x(){return(x=e((()=>{v=6e4,y=60*v,b=24*y})))()}function S({event:e,myState:t,isSaving:n=!1,onRespond:i,now:a=new Date}){let s=o(),c=new Date(e.startTime),l=_(e.startTime,a),d=t===`ATTENDING`,f=t===`ABSENT`;return(0,C.jsxs)(`section`,{"aria-label":`Next up`,className:`relative mt-4 overflow-hidden rounded-3xl p-4 text-white`,style:{background:`linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)`,boxShadow:`0 14px 34px rgba(34, 92, 156, 0.18)`},children:[(0,C.jsx)(`span`,{"aria-hidden":`true`,className:`pointer-events-none absolute -right-8 -top-10 h-[150px] w-[150px] rounded-full bg-white/15 blur-sm`}),(0,C.jsxs)(`div`,{className:`pointer-events-none absolute right-4 top-4 z-10 text-right`,children:[(0,C.jsx)(`span`,{className:`font-display block text-[22px] font-extrabold leading-none`,children:l.value}),(0,C.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.08em] opacity-85`,children:l.unit})]}),(0,C.jsx)(`p`,{className:`pr-12 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90`,children:`Next up`}),(0,C.jsx)(`h3`,{className:`font-display mb-1 mt-2 pr-12 text-[21px] font-extrabold leading-[1.08]`,children:(0,C.jsx)(r,{to:s.event(e.id),className:`after:absolute after:inset-0 after:rounded-3xl after:bg-white/0 after:transition-colors after:duration-200 hover:underline hover:after:bg-white/[0.07] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-white`,children:e.title})}),(0,C.jsxs)(`p`,{className:`flex flex-wrap items-center gap-1.5 text-[13px] text-white/95`,children:[(0,C.jsx)(p,{size:13,className:`shrink-0`}),c.toLocaleDateString(`nl-NL`,{weekday:`short`,day:`numeric`,month:`short`}),` · `,c.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})]}),e.location&&(0,C.jsxs)(`p`,{className:`mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-white/95`,children:[(0,C.jsx)(m,{size:13,className:`shrink-0`}),(0,C.jsx)(`a`,{href:`https://maps.google.com/?q=${encodeURIComponent(e.location)}`,target:`_blank`,rel:`noopener noreferrer`,className:`relative z-10 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white`,children:e.location})]}),(0,C.jsxs)(`p`,{className:`mt-2.5 text-[13px] text-white/90`,children:[e.attendanceSummary.attending,` going · `,w[t]]}),(0,C.jsxs)(`div`,{className:`relative z-10 mt-3.5 flex gap-2`,children:[(0,C.jsxs)(`button`,{"aria-pressed":d,disabled:n,onClick:()=>i(`ATTENDING`),style:f?void 0:{color:`var(--color-green-dark)`},className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,f?`bg-white/20 text-white`:`bg-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,C.jsx)(u,{size:16}),`I'm in`]}),(0,C.jsxs)(`button`,{"aria-pressed":f,disabled:n,onClick:()=>i(`ABSENT`),style:f?{color:`var(--color-red)`}:void 0,className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,f?`bg-white`:d?`bg-white/12 text-white`:`bg-white/20 text-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,C.jsx)(g,{size:16}),`Can't make it`]})]})]})}var C,w;function T(){return(T=e((()=>{t(),l(),d(),f(),h(),x(),s(),C=a(),w={ATTENDING:`you're in`,ABSENT:`you're out`,MAYBE:`you said maybe`,NOT_RESPONDED:`you haven't replied`},S.__docgenInfo={description:`The Next Up hero: the most imminent event, big, with its countdown and an inline RSVP so the
commonest action on the page costs no navigation.

Prop-only, and mounted conditionally — the parent decides whether there is a hero at all
(\`selectHeroEvent\`), and drops the event from the list below so it never renders twice. There is
deliberately no empty state here: when nothing is near, the page has no hero, not a hero saying
nothing is near.`,methods:[],displayName:`NextEventHeroView`,props:{event:{required:!0,tsType:{name:`Event`},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:`The viewer's own response — drives the CTA styling and the status line.`},isSaving:{required:!1,tsType:{name:`boolean`},description:`An RSVP is in flight; both buttons are held until it settles.`,defaultValue:{value:`false`,computed:!1}},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:``},now:{required:!1,tsType:{name:`Date`},description:`Injected so the countdown is deterministic in stories; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}}}}})))()}function E(e){let{left:t,top:n,width:r,height:i}=e.getBoundingClientRect();return document.elementFromPoint(t+r/2,n+i/2)}var D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{i(),T(),{expect:D,fn:O}=__STORYBOOK_MODULE_TEST__,k=new Date(2026,7,10,9,0),A=c({id:`evt-hero`,eventType:{id:`et-2`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,startTime:new Date(2026,7,12,20,0).toISOString(),location:`Sporthal De Toekomst`,attendanceSummary:{attending:10,maybe:1,absent:0,notResponded:4,roleBreakdown:[]}}),j={title:`widgets/next-event-hero/NextEventHeroView`,component:S,decorators:[n],args:{event:A,now:k,myState:`NOT_RESPONDED`,onRespond:O()}},M={play:async({canvas:e})=>{await D(e.getByText(`Next up`)).toBeInTheDocument(),await D(e.getByText(`Training — Court 2`)).toBeInTheDocument(),await D(e.getByText(`Sporthal De Toekomst`)).toBeInTheDocument(),await D(e.getByText(`2d`)).toBeInTheDocument()}},N={play:async({canvas:e})=>{await D(e.getByText(/10 going · you haven't replied/)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await D(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},P={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await D(e.getByText(/10 going · you're in/)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`)}},F={args:{myState:`ABSENT`},play:async({canvas:e})=>{await D(e.getByText(/10 going · you're out/)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`true`)}},I={args:{myState:`MAYBE`},play:async({canvas:e})=>{await D(e.getByText(/10 going · you said maybe/)).toBeInTheDocument(),await D(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await D(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},L={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/I'm in/})),await D(n.onRespond).toHaveBeenCalledWith(`ATTENDING`)}},R={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Can't make it/})),await D(n.onRespond).toHaveBeenCalledWith(`ABSENT`)}},z={args:{isSaving:!0},play:async({canvas:e,userEvent:t,args:n})=>{await D(e.getByRole(`button`,{name:/I'm in/})).toBeDisabled(),await D(e.getByRole(`button`,{name:/Can't make it/})).toBeDisabled(),await t.click(e.getByRole(`button`,{name:/I'm in/})),await D(n.onRespond).not.toHaveBeenCalled()}},B={play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:A.title}),r=t.querySelector(`section`);for(let t of[e.getByText(`Next up`),e.getByText(`2d`),e.getByText(/20:00/),e.getByText(/10 going/)])await D(E(t)).toBe(n);let{left:i,bottom:a,width:o}=r.getBoundingClientRect();await D(document.elementFromPoint(i+o/2,a-4)).toBe(n)}},V={play:async({canvas:e,canvasElement:t})=>{for(let t of[/I'm in/,/Can't make it/]){let n=e.getByRole(`button`,{name:t});await D(E(n)?.closest(`button`)).toBe(n)}let n=e.getByRole(`link`,{name:A.location});await D(E(n)?.closest(`a`)).toBe(n),await D(n).toHaveAttribute(`href`,D.stringContaining(`maps.google.com`)),await D(n).toHaveAttribute(`target`,`_blank`),await D(t.querySelectorAll(`a a`)).toHaveLength(0)}},H={args:{event:c({...A,startTime:new Date(2026,7,10,20,0).toISOString()})},play:async({canvas:e})=>{await D(e.getByText(`11h`)).toBeInTheDocument()}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument();
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument();
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument();
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    canvasElement
  }) => {
    const cardLink = canvas.getByRole('link', {
      name: EVENT.title
    });
    const hero = canvasElement.querySelector('section')!;

    // Passive rows: each one hits the card link, not the text node under the cursor.
    for (const passive of [canvas.getByText('Next up'), canvas.getByText('2d'),
    // the countdown block sits above the overlay but lets taps through
    canvas.getByText(/20:00/),
    // the date · time row
    canvas.getByText(/10 going/)]) {
      await expect(topmostAtCentreOf(passive)).toBe(cardLink);
    }

    // Bare padding — the strip below the buttons — is part of the target too.
    const {
      left,
      bottom,
      width
    } = hero.getBoundingClientRect();
    await expect(document.elementFromPoint(left + width / 2, bottom - 4)).toBe(cardLink);
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    canvasElement
  }) => {
    for (const name of [/I'm in/, /Can't make it/]) {
      const button = canvas.getByRole('button', {
        name
      });
      await expect(topmostAtCentreOf(button)?.closest('button')).toBe(button);
    }

    // (The matching hover affordance — the card washes and the title underlines over the passive
    // rows, but stays quiet over these buttons — hangs off the link's own :hover, since the overlay
    // is the link's hit area. It is not asserted here: \`userEvent\` is synthetic and never moves a
    // real cursor, so CSS :hover cannot be driven at this layer.)

    // The location opens maps, so it stays its own target — and stays a *sibling* of the card link
    // rather than a nested <a>, which is invalid HTML.
    const maps = canvas.getByRole('link', {
      name: EVENT.location
    });
    await expect(topmostAtCentreOf(maps)?.closest('a')).toBe(maps);
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    await expect(maps).toHaveAttribute('target', '_blank');
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}},U=[`HasNext`,`HaventReplied`,`Going`,`NotGoing`,`Maybe`,`RsvpIn`,`RsvpOut`,`Saving`,`WholeCardIsClickable`,`ControlsStayAboveTheOverlay`,`StartingToday`]})))()}W();export{V as ControlsStayAboveTheOverlay,P as Going,M as HasNext,N as HaventReplied,I as Maybe,F as NotGoing,L as RsvpIn,R as RsvpOut,z as Saving,H as StartingToday,B as WholeCardIsClickable,U as __namedExportsOrder,j as default};