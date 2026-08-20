import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./router-decorator-Y94k_WQY.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o}from"./event-fixtures-BaYeuP-I.js";import{n as s,t as c}from"./check-BtPhMidL.js";import{i as l,n as u,r as d,t as f}from"./map-pin-DptzFGvV.js";import{n as p,t as m}from"./x-BezGFqSR.js";function h(e,t){let n=(e instanceof Date?e:new Date(e)).getTime()-t.getTime();return n<=0?{value:`Now`,unit:`on`}:n>=v?{value:`${Math.floor(n/v)}d`,unit:`away`}:n>=_?{value:`${Math.floor(n/_)}h`,unit:`away`}:{value:`${Math.max(1,Math.floor(n/g))}m`,unit:`away`}}var g,_,v;function y(){return(y=e((()=>{g=6e4,_=60*g,v=24*_})))()}function b({event:e,myState:t,isSaving:n=!1,onRespond:i,now:a=new Date}){let o=new Date(e.startTime),s=h(e.startTime,a),l=t===`ATTENDING`,u=t===`ABSENT`;return(0,x.jsxs)(`section`,{"aria-label":`Next up`,className:`relative mt-4 overflow-hidden rounded-3xl p-4 text-white`,style:{background:`linear-gradient(135deg, var(--color-green) 0%, var(--color-green-dark) 100%)`,boxShadow:`0 14px 34px rgba(34, 92, 156, 0.18)`},children:[(0,x.jsx)(`span`,{"aria-hidden":`true`,className:`pointer-events-none absolute -right-8 -top-10 h-[150px] w-[150px] rounded-full bg-white/15 blur-sm`}),(0,x.jsxs)(`div`,{className:`pointer-events-none absolute right-4 top-4 z-10 text-right`,children:[(0,x.jsx)(`span`,{className:`font-display block text-[22px] font-extrabold leading-none`,children:s.value}),(0,x.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.08em] opacity-85`,children:s.unit})]}),(0,x.jsx)(`p`,{className:`pr-12 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90`,children:`Next up`}),(0,x.jsx)(`h3`,{className:`font-display mb-1 mt-2 pr-12 text-[21px] font-extrabold leading-[1.08]`,children:(0,x.jsx)(r,{to:`/events/$eventId`,params:{eventId:e.id},className:`after:absolute after:inset-0 after:rounded-3xl after:bg-white/0 after:transition-colors after:duration-200 hover:underline hover:after:bg-white/[0.07] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-white`,children:e.title})}),(0,x.jsxs)(`p`,{className:`flex flex-wrap items-center gap-1.5 text-[13px] text-white/95`,children:[(0,x.jsx)(d,{size:13,className:`shrink-0`}),o.toLocaleDateString(`nl-NL`,{weekday:`short`,day:`numeric`,month:`short`}),` · `,o.toLocaleTimeString(`nl-NL`,{hour:`2-digit`,minute:`2-digit`})]}),e.location&&(0,x.jsxs)(`p`,{className:`mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-white/95`,children:[(0,x.jsx)(f,{size:13,className:`shrink-0`}),(0,x.jsx)(`a`,{href:`https://maps.google.com/?q=${encodeURIComponent(e.location)}`,target:`_blank`,rel:`noopener noreferrer`,className:`relative z-10 underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white`,children:e.location})]}),(0,x.jsxs)(`p`,{className:`mt-2.5 text-[13px] text-white/90`,children:[e.attendanceSummary.attending,` going · `,S[t]]}),(0,x.jsxs)(`div`,{className:`relative z-10 mt-3.5 flex gap-2`,children:[(0,x.jsxs)(`button`,{"aria-pressed":l,disabled:n,onClick:()=>i(`ATTENDING`),style:u?void 0:{color:`var(--color-green-dark)`},className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,u?`bg-white/20 text-white`:`bg-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,x.jsx)(c,{size:16}),`I'm in`]}),(0,x.jsxs)(`button`,{"aria-pressed":u,disabled:n,onClick:()=>i(`ABSENT`),style:u?{color:`var(--color-red)`}:void 0,className:[`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-bold transition-all active:scale-95`,u?`bg-white`:l?`bg-white/12 text-white`:`bg-white/20 text-white`,n?`cursor-not-allowed opacity-60`:`cursor-pointer`].join(` `),children:[(0,x.jsx)(m,{size:16}),`Can't make it`]})]})]})}var x,S;function C(){return(C=e((()=>{t(),s(),l(),u(),p(),y(),x=a(),S={ATTENDING:`you're in`,ABSENT:`you're out`,MAYBE:`you said maybe`,NOT_RESPONDED:`you haven't replied`},b.__docgenInfo={description:`The Next Up hero: the most imminent event, big, with its countdown and an inline RSVP so the
commonest action on the page costs no navigation.

Prop-only, and mounted conditionally — the parent decides whether there is a hero at all
(\`selectHeroEvent\`), and drops the event from the list below so it never renders twice. There is
deliberately no empty state here: when nothing is near, the page has no hero, not a hero saying
nothing is near.`,methods:[],displayName:`NextEventHeroView`,props:{event:{required:!0,tsType:{name:`Event`},description:``},myState:{required:!0,tsType:{name:`AttendanceState`},description:`The viewer's own response — drives the CTA styling and the status line.`},isSaving:{required:!1,tsType:{name:`boolean`},description:`An RSVP is in flight; both buttons are held until it settles.`,defaultValue:{value:`false`,computed:!1}},onRespond:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(state: AttendanceState) => void`,signature:{arguments:[{type:{name:`AttendanceState`},name:`state`}],return:{name:`void`}}},description:``},now:{required:!1,tsType:{name:`Date`},description:`Injected so the countdown is deterministic in stories; defaults to the real clock.`,defaultValue:{value:`new Date()`,computed:!1}}}}})))()}function w(e){let{left:t,top:n,width:r,height:i}=e.getBoundingClientRect();return document.elementFromPoint(t+r/2,n+i/2)}var T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{i(),C(),{expect:T,fn:E}=__STORYBOOK_MODULE_TEST__,D=new Date(2026,7,10,9,0),O=o({id:`evt-hero`,eventType:{id:`et-2`,name:`Training`,color:`#249E6C`},title:`Training — Court 2`,startTime:new Date(2026,7,12,20,0).toISOString(),location:`Sporthal De Toekomst`,attendanceSummary:{attending:10,maybe:1,absent:0,notResponded:4,roleBreakdown:[]}}),k={title:`widgets/next-event-hero/NextEventHeroView`,component:b,decorators:[n],args:{event:O,now:D,myState:`NOT_RESPONDED`,onRespond:E()}},A={play:async({canvas:e})=>{await T(e.getByText(`Next up`)).toBeInTheDocument(),await T(e.getByText(`Training — Court 2`)).toBeInTheDocument(),await T(e.getByText(`Sporthal De Toekomst`)).toBeInTheDocument(),await T(e.getByText(`2d`)).toBeInTheDocument()}},j={play:async({canvas:e})=>{await T(e.getByText(/10 going · you haven't replied/)).toBeInTheDocument(),await T(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await T(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},M={args:{myState:`ATTENDING`},play:async({canvas:e})=>{await T(e.getByText(/10 going · you're in/)).toBeInTheDocument(),await T(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`true`)}},N={args:{myState:`ABSENT`},play:async({canvas:e})=>{await T(e.getByText(/10 going · you're out/)).toBeInTheDocument(),await T(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`true`)}},P={args:{myState:`MAYBE`},play:async({canvas:e})=>{await T(e.getByText(/10 going · you said maybe/)).toBeInTheDocument(),await T(e.getByRole(`button`,{name:/I'm in/})).toHaveAttribute(`aria-pressed`,`false`),await T(e.getByRole(`button`,{name:/Can't make it/})).toHaveAttribute(`aria-pressed`,`false`)}},F={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/I'm in/})),await T(n.onRespond).toHaveBeenCalledWith(`ATTENDING`)}},I={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Can't make it/})),await T(n.onRespond).toHaveBeenCalledWith(`ABSENT`)}},L={args:{isSaving:!0},play:async({canvas:e,userEvent:t,args:n})=>{await T(e.getByRole(`button`,{name:/I'm in/})).toBeDisabled(),await T(e.getByRole(`button`,{name:/Can't make it/})).toBeDisabled(),await t.click(e.getByRole(`button`,{name:/I'm in/})),await T(n.onRespond).not.toHaveBeenCalled()}},R={play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:O.title}),r=t.querySelector(`section`);for(let t of[e.getByText(`Next up`),e.getByText(`2d`),e.getByText(/20:00/),e.getByText(/10 going/)])await T(w(t)).toBe(n);let{left:i,bottom:a,width:o}=r.getBoundingClientRect();await T(document.elementFromPoint(i+o/2,a-4)).toBe(n)}},z={play:async({canvas:e,canvasElement:t})=>{for(let t of[/I'm in/,/Can't make it/]){let n=e.getByRole(`button`,{name:t});await T(w(n)?.closest(`button`)).toBe(n)}let n=e.getByRole(`link`,{name:O.location});await T(w(n)?.closest(`a`)).toBe(n),await T(n).toHaveAttribute(`href`,T.stringContaining(`maps.google.com`)),await T(n).toHaveAttribute(`target`,`_blank`),await T(t.querySelectorAll(`a a`)).toHaveLength(0)}},B={args:{event:o({...O,startTime:new Date(2026,7,10,20,0).toISOString()})},play:async({canvas:e})=>{await T(e.getByText(`11h`)).toBeInTheDocument()}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Next up')).toBeInTheDocument();
    await expect(canvas.getByText('Training — Court 2')).toBeInTheDocument();
    await expect(canvas.getByText('Sporthal De Toekomst')).toBeInTheDocument();
    // Two days and eleven hours out, floored to the largest useful unit.
    await expect(canvas.getByText('2d')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}},V=[`HasNext`,`HaventReplied`,`Going`,`NotGoing`,`Maybe`,`RsvpIn`,`RsvpOut`,`Saving`,`WholeCardIsClickable`,`ControlsStayAboveTheOverlay`,`StartingToday`]})))()}H();export{z as ControlsStayAboveTheOverlay,M as Going,A as HasNext,j as HaventReplied,P as Maybe,N as NotGoing,F as RsvpIn,I as RsvpOut,L as Saving,B as StartingToday,R as WholeCardIsClickable,V as __namedExportsOrder,k as default};