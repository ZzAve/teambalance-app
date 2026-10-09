import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-DkceZQlu.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-DUXBP51x.js";import{c as a,i as o,r as s,s as c,t as l}from"./event-fixtures-C1ds5yXh.js";import{n as u,t as d}from"./EventLineupPanel-SGAR0i39.js";function f(e){let[t,n]=(0,p.useState)(e.attendances);return(0,m.jsx)(d,{...e,attendances:t,onRespond:(t,r)=>{e.onRespond(t,r),n(e=>e.map(e=>e.userId===t?{...e,state:r}:e))}})}var p,m,h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{p=t(),s(),r(),u(),m=n(),{expect:h,fn:g,within:_}=__STORYBOOK_MODULE_TEST__,v=[o(`u-anna`,`Anna Bakker`,`Setter`),o(`u-bram`,`Bram de Vries`,`Setter`),o(`u-carmen`,`Carmen Jansen`,`Setter`,{state:`ABSENT`}),o(`u-daan`,`Daan Willems`,`Outside`),o(`u-eva`,`Eva Smit`,`Outside`),o(`u-femke`,`Femke Koning`,`Outside`),o(`u-gijs`,`Gijs Mulder`,`Outside`),o(`u-hanna`,`Hanna Vos`,`Outside`),o(`u-iris`,`Iris Kok`,`Outside`),o(`u-ivo`,`Ivo Peters`,`Outside`,{state:`MAYBE`}),o(`u-julia`,`Julia Meijer`,`Outside`,{state:`NOT_RESPONDED`}),o(`u-koen`,`Koen Bos`,`Middle`),o(`u-lotte`,`Lotte Dijkstra`,`Middle`,{state:`MAYBE`}),o(`u-mees`,`Mees van Dam`,`Middle`,{state:`NOT_RESPONDED`}),o(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`}),o(`u-pien`,`Pien Groot`,`Coach`),o(`u-quinn`,`Quinn Aalders`,`Unassigned`,{state:`MAYBE`}),o(`u-roos`,`Roos Timmer`,`Unassigned`,{state:`NOT_RESPONDED`})],y=[a(`sub-jan`,`Jan de Vries`,{position:{id:`p-libero`,label:`Libero`},state:`MAYBE`,changedBy:`u-eva`}),a(`sub-femke`,`Femke Dekker`,{changedBy:`u-eva`})],b=[{id:`p-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`p-outside`,label:`Outside`,required:4,attending:6,kind:`PLAYING`},{id:`p-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`},{id:`p-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`p-coach`,label:`Coach`,required:void 0,attending:1,kind:`STAFF`}],x={title:`widgets/event-panel/EventLineupPanel`,component:d,args:{attendances:v,roster:c({positions:b,totalAttending:11,totalTarget:void 0}),currentUserId:`u-eva`,substitutes:y,onRespond:g(),onCallInSubstitutes:g(),onSetSubstituteState:g(),onTakeOffSubstitute:g()},decorators:[e=>(0,m.jsx)(`div`,{className:`mx-auto w-full max-w-[360px] rounded-2xl border border-border/40 bg-card p-3.5`,children:(0,m.jsx)(e,{})})]},S={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await h(e.getByText(`covered`)).toBeInTheDocument(),await h(e.getByText(`2 spare`)).toBeInTheDocument(),await h(e.getByText(`needs 1 more`)).toBeInTheDocument(),await h(e.getByText(`nobody yet`)).toBeInTheDocument(),await h(e.getByText(`2 of 4 covered`)).toBeInTheDocument(),await h(e.getByRole(`button`,{name:/Jan de Vries, substitute — Maybe/})).toBeInTheDocument(),await h(e.getByRole(`button`,{name:/Femke Dekker, substitute — Going/})).toBeInTheDocument(),await h(e.getByText(`1 sub`)).toBeInTheDocument()}},C={render:e=>(0,m.jsx)(i,{items:{"Nobody yet":(0,m.jsx)(d,{...e,attendances:[],substitutes:[],roster:c({positions:[],totalAttending:0})}),"A position nobody plays":(0,m.jsx)(d,{...e,attendances:[o(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`})],roster:c({positions:[b[3]],totalAttending:0})}),"Headcount only":(0,m.jsx)(d,{...e,roster:c({positions:[b[4]],totalAttending:11,totalTarget:12})}),"Untracked social":(0,m.jsx)(d,{...e,roster:c({...l,totalAttending:11})}),"Crowded position collapsed":(0,m.jsx)(d,{...e}),"Crowded position expanded":(0,m.jsx)(d,{...e}),Pending:(0,m.jsx)(d,{...e,pending:!0})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>_(e.getByRole(`region`,{name:t}));await h(n(`Nobody yet`).getByText(`Nobody has answered yet.`)).toBeInTheDocument(),await h(n(`A position nobody plays`).getByText(`nobody yet`)).toBeInTheDocument(),await h(n(`A position nobody plays`).getByRole(`button`,{name:/Nina Hendriks — Can't/})).toBeInTheDocument(),await h(n(`Headcount only`).getByText(`10/12 going`)).toBeInTheDocument(),await h(n(`Headcount only`).getByText(/1 staff also going/)).toBeInTheDocument(),await h(n(`Untracked social`).getByText(`11 going`)).toBeInTheDocument(),await h(n(`Untracked social`).queryByText(`covered`)).not.toBeInTheDocument(),await h(n(`Crowded position collapsed`).getByRole(`button`,{name:`Show 2 more going`})).toBeInTheDocument(),await h(n(`Crowded position collapsed`).queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument(),await t.click(n(`Crowded position expanded`).getByRole(`button`,{name:`Show 2 more going`})),await h(n(`Crowded position expanded`).getByRole(`button`,{name:/Hanna Vos — Going/})).toBeInTheDocument(),await h(n(`Crowded position expanded`).getByRole(`button`,{name:/Iris Kok — Going/})).toBeInTheDocument(),await h(n(`Crowded position expanded`).getByRole(`button`,{name:`Show fewer going`})).toBeInTheDocument(),await t.click(n(`Pending`).getByRole(`button`,{name:/Lotte Dijkstra/})),await h(await _(document.body).findByRole(`button`,{name:`Going`})).toBeDisabled(),await t.keyboard(`{Escape}`),await h(_(document.body).queryByRole(`dialog`)).not.toBeInTheDocument()}},w={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,m.jsx)(i,{items:{Squad:(0,m.jsx)(d,{...e}),"Live count":(0,m.jsx)(f,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>_(e.getByRole(`region`,{name:t})),i=_(document.body);await t.click(r(`Squad`).getByRole(`button`,{name:`Show 2 more going`})),await h(r(`Squad`).getByRole(`button`,{name:/Iris Kok — Going/})).toBeInTheDocument(),await t.click(r(`Squad`).getByRole(`button`,{name:`Show fewer going`})),await h(r(`Squad`).queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument(),await t.click(r(`Squad`).getByRole(`button`,{name:/Lotte Dijkstra — Maybe/}));let a=await i.findByRole(`dialog`);await h(a).toHaveTextContent(`Lotte Dijkstra`),await h(a).toHaveTextContent(`Middle · currently maybe · you are answering for them`),await t.click(i.getByRole(`button`,{name:`Going`})),await h(n.onRespond).toHaveBeenCalledWith(`u-lotte`,`ATTENDING`),await t.click(r(`Squad`).getByRole(`button`,{name:/Eva Smit \(you\) — Going/}));let o=await i.findByRole(`dialog`);await h(o).toHaveTextContent(`Outside · currently going`),await h(o).not.toHaveTextContent(`answering for them`),await t.click(i.getByRole(`button`,{name:`Can't go`})),await h(n.onRespond).toHaveBeenCalledWith(`u-eva`,`ABSENT`),await t.click(r(`Squad`).getByRole(`button`,{name:`Find a Libero`})),await h(n.onCallInSubstitutes).toHaveBeenCalledWith({id:`p-libero`,label:`Libero`}),await t.click(r(`Squad`).getByRole(`button`,{name:`Call in substitutes`})),await h(n.onCallInSubstitutes).toHaveBeenCalledWith(null),await t.click(r(`Squad`).getByRole(`button`,{name:/Jan de Vries, substitute — Maybe/}));let s=_(await i.findByRole(`dialog`,{name:`Jan de Vries`}));await h(s.getByText(`Substitute · Libero · set by Eva Smit`)).toBeInTheDocument(),await h(s.queryByText(/answering for them/)).not.toBeInTheDocument(),await t.click(s.getByRole(`button`,{name:`Going`})),await h(n.onSetSubstituteState).toHaveBeenCalledWith(`sub-jan`,`ATTENDING`),await t.click(r(`Squad`).getByRole(`button`,{name:/Jan de Vries, substitute/})),await t.click(_(await i.findByRole(`dialog`,{name:`Jan de Vries`})).getByRole(`button`,{name:`Take off this event`})),await h(n.onTakeOffSubstitute).toHaveBeenCalledWith(`sub-jan`),await h(n.onRespond).not.toHaveBeenCalledWith(`sub-jan`,h.anything()),await h(r(`Live count`).getByText(`needs 1 more`)).toBeInTheDocument(),await h(r(`Live count`).getByText(`2 of 4 covered`)).toBeInTheDocument(),await t.click(r(`Live count`).getByRole(`button`,{name:/Lotte Dijkstra — Maybe/})),await t.click(i.getByRole(`button`,{name:`Going`})),await h(r(`Live count`).queryByText(`needs 1 more`)).not.toBeInTheDocument(),await h(r(`Live count`).getByText(`3 of 4 covered`)).toBeInTheDocument()}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  play: async ({
    canvas
  }) => {
    // The verdict word leads and the fraction follows, for each of the four row states.
    await expect(canvas.getByText('covered')).toBeInTheDocument();
    await expect(canvas.getByText('2 spare')).toBeInTheDocument();
    await expect(canvas.getByText('needs 1 more')).toBeInTheDocument();
    await expect(canvas.getByText('nobody yet')).toBeInTheDocument();
    await expect(canvas.getByText('2 of 4 covered')).toBeInTheDocument();
    // A Substitute sits in their Position row, marked as one, in whatever state they are in; the
    // header counts the ones going.
    await expect(canvas.getByRole('button', {
      name: /Jan de Vries, substitute — Maybe/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('button', {
      name: /Femke Dekker, substitute — Going/
    })).toBeInTheDocument();
    await expect(canvas.getByText('1 sub')).toBeInTheDocument();
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    'Nobody yet': <EventLineupPanel {...args} attendances={[]} substitutes={[]} roster={makeRoster({
      positions: [],
      totalAttending: 0
    })} />,
    // Everyone declined a position the server therefore dropped — the row the old pips panel lost.
    'A position nobody plays': <EventLineupPanel {...args} attendances={[makeAttendee('u-nina', 'Nina Hendriks', 'Libero', {
      state: 'ABSENT'
    })]} roster={makeRoster({
      positions: [POSITIONS[3]],
      totalAttending: 0
    })} />,
    // A headcount target with no position targets: no covered fraction to state, so the header
    // falls back to the headcount, and the staff note explains why it is smaller than the room.
    'Headcount only': <EventLineupPanel {...args} roster={makeRoster({
      positions: [POSITIONS[4]],
      totalAttending: 11,
      totalTarget: 12
    })} />,
    // A social: tracking off, so there are no targets — just who is coming, grouped by position.
    'Untracked social': <EventLineupPanel {...args} roster={makeRoster({
      ...NO_ROSTER,
      totalAttending: 11
    })} />,
    // Six going in Outside, capped at five: four chips and a counter for the rest.
    'Crowded position collapsed': <EventLineupPanel {...args} />,
    // The same crowded row, expanded past the cap: all six chips plus "Show fewer going" — left
    // open by this story's own play rather than closed, unlike \`Interactions\` which clicks it
    // straight back shut.
    'Crowded position expanded': <EventLineupPanel {...args} />,
    // A write is in flight: the control is held so a second tap cannot race the first.
    Pending: <EventLineupPanel {...args} pending />
  }} />,
  play: async ({
    canvas,
    userEvent
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    await expect(region('Nobody yet').getByText('Nobody has answered yet.')).toBeInTheDocument();
    await expect(region('A position nobody plays').getByText('nobody yet')).toBeInTheDocument();
    await expect(region('A position nobody plays').getByRole('button', {
      name: /Nina Hendriks — Can't/
    })).toBeInTheDocument();
    await expect(region('Headcount only').getByText('10/12 going')).toBeInTheDocument();
    await expect(region('Headcount only').getByText(/1 staff also going/)).toBeInTheDocument();
    await expect(region('Untracked social').getByText('11 going')).toBeInTheDocument();
    await expect(region('Untracked social').queryByText('covered')).not.toBeInTheDocument();
    await expect(region('Crowded position collapsed').getByRole('button', {
      name: 'Show 2 more going'
    })).toBeInTheDocument();
    await expect(region('Crowded position collapsed').queryByRole('button', {
      name: /Iris Kok/
    })).not.toBeInTheDocument();

    // Expand the twin instance and leave it open — this is the frame the snapshot keeps.
    await userEvent.click(region('Crowded position expanded').getByRole('button', {
      name: 'Show 2 more going'
    }));
    await expect(region('Crowded position expanded').getByRole('button', {
      name: /Hanna Vos — Going/
    })).toBeInTheDocument();
    await expect(region('Crowded position expanded').getByRole('button', {
      name: /Iris Kok — Going/
    })).toBeInTheDocument();
    await expect(region('Crowded position expanded').getByRole('button', {
      name: 'Show fewer going'
    })).toBeInTheDocument();
    await userEvent.click(region('Pending').getByRole('button', {
      name: /Lotte Dijkstra/
    }));
    await expect(await within(document.body).findByRole('button', {
      name: 'Going'
    })).toBeDisabled();
    // The sheet is a portal with fixed positioning: a disabled toggle can't auto-close it by
    // answering, so close it explicitly or it is still open — on top of every other section — in
    // the frame this story snapshots.
    await userEvent.keyboard('{Escape}');
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  },
  render: args => <Stack items={{
    Squad: <EventLineupPanel {...args} />,
    'Live count': <LivePanel {...args} />
  }} />,
  play: async ({
    canvas,
    userEvent,
    args
  }) => {
    const region = (name: string) => within(canvas.getByRole('region', {
      name
    }));
    const body = within(document.body);

    // Expanding a crowded position: six going in Outside, capped at five.
    await userEvent.click(region('Squad').getByRole('button', {
      name: 'Show 2 more going'
    }));
    await expect(region('Squad').getByRole('button', {
      name: /Iris Kok — Going/
    })).toBeInTheDocument();
    // And back: the counter becomes the way to re-collapse, so the row is never stuck open.
    await userEvent.click(region('Squad').getByRole('button', {
      name: 'Show fewer going'
    }));
    await expect(region('Squad').queryByRole('button', {
      name: /Iris Kok/
    })).not.toBeInTheDocument();

    // Answering for a teammate — the sheet is portalled out of the canvas, so it is queried from the
    // document (as the manage-positions dialogs are).
    await userEvent.click(region('Squad').getByRole('button', {
      name: /Lotte Dijkstra — Maybe/
    }));
    const teammateSheet = await body.findByRole('dialog');
    // The sheet names whose answer is about to change — ADR-0003 allows it, but you should know.
    await expect(teammateSheet).toHaveTextContent('Lotte Dijkstra');
    await expect(teammateSheet).toHaveTextContent('Middle · currently maybe · you are answering for them');
    await userEvent.click(body.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-lotte', 'ATTENDING');

    // Answering for yourself — no "you are answering for them" on your own row; it is a warning, not
    // a label.
    await userEvent.click(region('Squad').getByRole('button', {
      name: /Eva Smit \\(you\\) — Going/
    }));
    const selfSheet = await body.findByRole('dialog');
    await expect(selfSheet).toHaveTextContent('Outside · currently going');
    await expect(selfSheet).not.toHaveTextContent('answering for them');
    await userEvent.click(body.getByRole('button', {
      name: "Can't go"
    }));
    await expect(args.onRespond).toHaveBeenCalledWith('u-eva', 'ABSENT');

    // An open spot is a way to fill it: the "+" opens the picker for that Position (#359); the
    // button under the lineup opens it for no Position in particular.
    await userEvent.click(region('Squad').getByRole('button', {
      name: 'Find a Libero'
    }));
    await expect(args.onCallInSubstitutes).toHaveBeenCalledWith({
      id: 'p-libero',
      label: 'Libero'
    });
    await userEvent.click(region('Squad').getByRole('button', {
      name: 'Call in substitutes'
    }));
    await expect(args.onCallInSubstitutes).toHaveBeenCalledWith(null);

    // A Substitute's chip opens the Substitute sheet, never the Member answer sheet: that one writes
    // Member attendance, and a Substitute's id must not reach it (ADR-0033).
    await userEvent.click(region('Squad').getByRole('button', {
      name: /Jan de Vries, substitute — Maybe/
    }));
    const subSheet = within(await body.findByRole('dialog', {
      name: 'Jan de Vries'
    }));
    await expect(subSheet.getByText('Substitute · Libero · set by Eva Smit')).toBeInTheDocument();
    await expect(subSheet.queryByText(/answering for them/)).not.toBeInTheDocument();
    await userEvent.click(subSheet.getByRole('button', {
      name: 'Going'
    }));
    await expect(args.onSetSubstituteState).toHaveBeenCalledWith('sub-jan', 'ATTENDING');
    await userEvent.click(region('Squad').getByRole('button', {
      name: /Jan de Vries, substitute/
    }));
    await userEvent.click(within(await body.findByRole('dialog', {
      name: 'Jan de Vries'
    })).getByRole('button', {
      name: 'Take off this event'
    }));
    await expect(args.onTakeOffSubstitute).toHaveBeenCalledWith('sub-jan');
    await expect(args.onRespond).not.toHaveBeenCalledWith('sub-jan', expect.anything());

    // The panel counts its fractions from the members it renders, so an answer moves the chip and
    // the count together — proved here by driving the same prop change a re-render would. Middle was
    // 1/2; Lotte's chip turning green is the same fact as the row reading covered.
    await expect(region('Live count').getByText('needs 1 more')).toBeInTheDocument();
    await expect(region('Live count').getByText('2 of 4 covered')).toBeInTheDocument();
    await userEvent.click(region('Live count').getByRole('button', {
      name: /Lotte Dijkstra — Maybe/
    }));
    await userEvent.click(body.getByRole('button', {
      name: 'Going'
    }));
    await expect(region('Live count').queryByText('needs 1 more')).not.toBeInTheDocument();
    await expect(region('Live count').getByText('3 of 4 covered')).toBeInTheDocument();
  }
}`,...w.parameters?.docs?.source}}},T=[`Data`,`Shells`,`Interactions`]})))()}E();export{S as Data,w as Interactions,C as Shells,T as __namedExportsOrder,x as default};