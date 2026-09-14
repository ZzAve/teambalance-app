import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-XXrJaDjg.js";import{i as n,r,s as i,t as a}from"./event-fixtures-CuRrQuRB.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";import{n as s,t as c}from"./modes-Bzyminl_.js";import{n as l,t as u}from"./EventLineupPanel-BhpOxSGf.js";function d(e){let[t,n]=(0,f.useState)(e.attendances);return(0,p.jsx)(u,{...e,attendances:t,onRespond:(t,r)=>{e.onRespond(t,r),n(e=>e.map(e=>e.userId===t?{...e,state:r}:e))}})}var f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{f=t(),r(),s(),l(),p=o(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_=[n(`u-anna`,`Anna Bakker`,`Setter`),n(`u-bram`,`Bram de Vries`,`Setter`),n(`u-carmen`,`Carmen Jansen`,`Setter`,{state:`ABSENT`}),n(`u-daan`,`Daan Willems`,`Outside`),n(`u-eva`,`Eva Smit`,`Outside`),n(`u-femke`,`Femke Koning`,`Outside`),n(`u-gijs`,`Gijs Mulder`,`Outside`),n(`u-hanna`,`Hanna Vos`,`Outside`),n(`u-iris`,`Iris Kok`,`Outside`),n(`u-ivo`,`Ivo Peters`,`Outside`,{state:`MAYBE`}),n(`u-julia`,`Julia Meijer`,`Outside`,{state:`NOT_RESPONDED`}),n(`u-koen`,`Koen Bos`,`Middle`),n(`u-lotte`,`Lotte Dijkstra`,`Middle`,{state:`MAYBE`}),n(`u-mees`,`Mees van Dam`,`Middle`,{state:`NOT_RESPONDED`}),n(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`}),n(`u-pien`,`Pien Groot`,`Coach`),n(`u-quinn`,`Quinn Aalders`,`Unassigned`,{state:`MAYBE`}),n(`u-roos`,`Roos Timmer`,`Unassigned`,{state:`NOT_RESPONDED`})],v=[{id:`p-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`p-outside`,label:`Outside`,required:4,attending:6,kind:`PLAYING`},{id:`p-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`},{id:`p-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`p-coach`,label:`Coach`,required:void 0,attending:1,kind:`STAFF`}],y={title:`widgets/event-panel/EventLineupPanel`,component:u,args:{attendances:_,roster:i({positions:v,totalAttending:11,totalTarget:void 0}),currentUserId:`u-eva`,onRespond:h()},decorators:[e=>(0,p.jsx)(`div`,{className:`mx-auto w-full max-w-[360px] rounded-2xl border border-border/40 bg-card p-3.5`,children:(0,p.jsx)(e,{})})],parameters:{chromatic:{modes:{light:c.light,dark:c.dark}}}},b={play:async({canvas:e})=>{await m(e.getByText(`covered`)).toBeInTheDocument(),await m(e.getByText(`2 spare`)).toBeInTheDocument(),await m(e.getByText(`needs 1 more`)).toBeInTheDocument(),await m(e.getByText(`nobody yet`)).toBeInTheDocument(),await m(e.getByText(`2 of 4 covered`)).toBeInTheDocument()}},x={args:{attendances:[],roster:i({positions:[],totalAttending:0})},play:async({canvas:e})=>{await m(e.getByText(`Nobody has answered yet.`)).toBeInTheDocument()}},S={args:{attendances:[n(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`})],roster:i({positions:[v[3]],totalAttending:0})},play:async({canvas:e})=>{await m(e.getByText(`nobody yet`)).toBeInTheDocument(),await m(e.getByRole(`button`,{name:/Nina Hendriks — Can't/})).toBeInTheDocument()}},C={args:{roster:i({positions:[v[4]],totalAttending:11,totalTarget:12})},play:async({canvas:e})=>{await m(e.getByText(`10/12 going`)).toBeInTheDocument(),await m(e.getByText(/1 staff also going/)).toBeInTheDocument()}},w={args:{roster:i({...a,totalAttending:11})},play:async({canvas:e})=>{await m(e.getByText(`11 going`)).toBeInTheDocument(),await m(e.queryByText(`covered`)).not.toBeInTheDocument()}},T={play:async({canvas:e})=>{await m(e.getByRole(`button`,{name:`Show 2 more going`})).toBeInTheDocument(),await m(e.queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument()}},E={play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:`Show 2 more going`})),await m(e.getByRole(`button`,{name:/Iris Kok — Going/})).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:`Show fewer going`})),await m(e.queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument()}},D={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Lotte Dijkstra — Maybe/}));let r=g(document.body),i=await r.findByRole(`dialog`);await m(i).toHaveTextContent(`Lotte Dijkstra`),await m(i).toHaveTextContent(`Middle · currently maybe · you are answering for them`),await t.click(r.getByRole(`button`,{name:`Going`})),await m(n.onRespond).toHaveBeenCalledWith(`u-lotte`,`ATTENDING`)}},O={play:async({canvas:e,userEvent:t,args:n})=>{await t.click(e.getByRole(`button`,{name:/Eva Smit \(you\) — Going/}));let r=g(document.body),i=await r.findByRole(`dialog`);await m(i).toHaveTextContent(`Outside · currently going`),await m(i).not.toHaveTextContent(`answering for them`),await t.click(r.getByRole(`button`,{name:`Can't go`})),await m(n.onRespond).toHaveBeenCalledWith(`u-eva`,`ABSENT`)}},k={args:{pending:!0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getByRole(`button`,{name:/Lotte Dijkstra/})),await m(await g(document.body).findByRole(`button`,{name:`Going`})).toBeDisabled()}},A={render:e=>(0,p.jsx)(d,{...e}),play:async({canvas:e,userEvent:t})=>{await m(e.getByText(`needs 1 more`)).toBeInTheDocument(),await m(e.getByText(`2 of 4 covered`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Lotte Dijkstra — Maybe/})),await t.click(g(document.body).getByRole(`button`,{name:`Going`})),await m(e.queryByText(`needs 1 more`)).not.toBeInTheDocument(),await m(e.getByText(`3 of 4 covered`)).toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // The verdict word leads and the fraction follows, for each of the four row states.
    await expect(canvas.getByText('covered')).toBeInTheDocument();
    await expect(canvas.getByText('2 spare')).toBeInTheDocument();
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument();
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument();
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    attendances: [],
    roster: makeRoster({
      positions: [],
      totalAttending: 0
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Nobody has answered yet.')).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source},description:{story:`Nobody has answered and nobody is configured: the panel says so rather than rendering blank.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    attendances: [makeAttendee('u-nina', 'Nina Hendriks', 'Libero', {
      state: 'ABSENT'
    })],
    roster: makeRoster({
      positions: [POSITIONS[3]],
      totalAttending: 0
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Nina Hendriks — Can't/
    })).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source},description:{story:`Everyone declined a position the server therefore dropped — the row the old pips panel lost.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      positions: [POSITIONS[4]],
      totalAttending: 11,
      totalTarget: 12
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('10/12 going')).toBeInTheDocument();
    await expect(canvas.getByText(/1 staff also going/)).toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source},description:{story:`A headcount target with no position targets. There is no covered fraction to state, so the header
falls back to the headcount — and the staff note explains why it is smaller than the room.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    roster: makeRoster({
      ...NO_ROSTER,
      totalAttending: 11
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('11 going')).toBeInTheDocument();
    await expect(canvas.queryByText('covered')).not.toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source},description:{story:`A social: tracking off, so there are no targets — just who is coming, grouped by position.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas
  }) => {
    // Six going in Outside, capped at five: four chips and a counter for the rest.
    await expect(canvas.getByRole('button', {
      name: 'Show 2 more going'
    })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', {
      name: /Iris Kok/
    })).not.toBeInTheDocument();
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: 'Show 2 more going'
    }));
    await expect(canvas.getByRole('button', {
      name: /Iris Kok — Going/
    })).toBeInTheDocument();
    // And back: the counter becomes the way to re-collapse, so the row is never stuck open.
    await userEvent.click(canvas.getByRole('button', {
      name: 'Show fewer going'
    }));
    await expect(canvas.queryByRole('button', {
      name: /Iris Kok/
    })).not.toBeInTheDocument();
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Lotte Dijkstra — Maybe/
    }));

    // The sheet is portalled out of the canvas, so it is queried from the document (as the
    // manage-positions dialogs are).
    const body = within(document.body);
    const sheet = await body.findByRole('dialog');
    // The sheet names whose answer is about to change — ADR-0003 allows it, but you should know.
    await expect(sheet).toHaveTextContent('Lotte Dijkstra');
    await expect(sheet).toHaveTextContent('Middle · currently maybe · you are answering for them');
    await userEvent.click(body.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-lotte', 'ATTENDING');
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Eva Smit \\(you\\) — Going/
    }));
    const body = within(document.body);
    const sheet = await body.findByRole('dialog');
    // No "you are answering for them" on your own row — it is a warning, not a label.
    await expect(sheet).toHaveTextContent('Outside · currently going');
    await expect(sheet).not.toHaveTextContent('answering for them');
    await userEvent.click(body.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-eva', 'ABSENT');
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    pending: true
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByRole('button', {
      name: /Lotte Dijkstra/
    }));
    await expect(await within(document.body).findByRole('button', {
      name: 'Going'
    })).toBeDisabled();
  }
}`,...k.parameters?.docs?.source},description:{story:`A write is in flight: the control is held so a second tap cannot race the first.`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <LivePanel {...args} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument();
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', {
      name: /Lotte Dijkstra — Maybe/
    }));
    await userEvent.click(within(document.body).getByRole('button', {
      name: 'Going'
    }));

    // Middle was 1/2; Lotte's chip turning green is the same fact as the row reading covered.
    await expect(canvas.queryByText('needs 1 more')).not.toBeInTheDocument();
    await expect(canvas.getByText('3 of 4 covered')).toBeInTheDocument();
  }
}`,...A.parameters?.docs?.source},description:{story:`The panel counts its fractions from the members it renders, so an answer moves the chip and the
count together. This is the state the events route holds while a write settles — proved here by
driving the same prop change a re-render would.`,...A.parameters?.docs?.description}}},j=[`Default`,`NobodyYet`,`APositionNobodyIsPlaying`,`HeadcountOnly`,`UntrackedSocial`,`CrowdedPositionCollapses`,`ExpandingACrowdedPosition`,`AnsweringForATeammate`,`AnsweringForYourself`,`Pending`,`AnswerMovesChipAndCountTogether`]})))()}M();export{S as APositionNobodyIsPlaying,A as AnswerMovesChipAndCountTogether,D as AnsweringForATeammate,O as AnsweringForYourself,T as CrowdedPositionCollapses,b as Default,E as ExpandingACrowdedPosition,C as HeadcountOnly,x as NobodyYet,k as Pending,w as UntrackedSocial,j as __namedExportsOrder,y as default};