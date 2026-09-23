import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t}from"./iframe-BiajjKFy.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./stack-D87d-8jv.js";import{i as a,r as o,s,t as c}from"./event-fixtures-CuRrQuRB.js";import{n as l,t as u}from"./EventLineupPanel--Y3ARHrK.js";function d(e){let[t,n]=(0,f.useState)(e.attendances);return(0,p.jsx)(u,{...e,attendances:t,onRespond:(t,r)=>{e.onRespond(t,r),n(e=>e.map(e=>e.userId===t?{...e,state:r}:e))}})}var f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{f=t(),o(),r(),l(),p=n(),{expect:m,fn:h,within:g}=__STORYBOOK_MODULE_TEST__,_=[a(`u-anna`,`Anna Bakker`,`Setter`),a(`u-bram`,`Bram de Vries`,`Setter`),a(`u-carmen`,`Carmen Jansen`,`Setter`,{state:`ABSENT`}),a(`u-daan`,`Daan Willems`,`Outside`),a(`u-eva`,`Eva Smit`,`Outside`),a(`u-femke`,`Femke Koning`,`Outside`),a(`u-gijs`,`Gijs Mulder`,`Outside`),a(`u-hanna`,`Hanna Vos`,`Outside`),a(`u-iris`,`Iris Kok`,`Outside`),a(`u-ivo`,`Ivo Peters`,`Outside`,{state:`MAYBE`}),a(`u-julia`,`Julia Meijer`,`Outside`,{state:`NOT_RESPONDED`}),a(`u-koen`,`Koen Bos`,`Middle`),a(`u-lotte`,`Lotte Dijkstra`,`Middle`,{state:`MAYBE`}),a(`u-mees`,`Mees van Dam`,`Middle`,{state:`NOT_RESPONDED`}),a(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`}),a(`u-pien`,`Pien Groot`,`Coach`),a(`u-quinn`,`Quinn Aalders`,`Unassigned`,{state:`MAYBE`}),a(`u-roos`,`Roos Timmer`,`Unassigned`,{state:`NOT_RESPONDED`})],v=[{id:`p-setter`,label:`Setter`,required:2,attending:2,kind:`PLAYING`},{id:`p-outside`,label:`Outside`,required:4,attending:6,kind:`PLAYING`},{id:`p-middle`,label:`Middle`,required:2,attending:1,kind:`PLAYING`},{id:`p-libero`,label:`Libero`,required:1,attending:0,kind:`PLAYING`},{id:`p-coach`,label:`Coach`,required:void 0,attending:1,kind:`STAFF`}],y={title:`widgets/event-panel/EventLineupPanel`,component:u,args:{attendances:_,roster:s({positions:v,totalAttending:11,totalTarget:void 0}),currentUserId:`u-eva`,onRespond:h()},decorators:[e=>(0,p.jsx)(`div`,{className:`mx-auto w-full max-w-[360px] rounded-2xl border border-border/40 bg-card p-3.5`,children:(0,p.jsx)(e,{})})]},b={parameters:{chromatic:{disableSnapshot:!0}},play:async({canvas:e})=>{await m(e.getByText(`covered`)).toBeInTheDocument(),await m(e.getByText(`2 spare`)).toBeInTheDocument(),await m(e.getByText(`needs 1 more`)).toBeInTheDocument(),await m(e.getByText(`nobody yet`)).toBeInTheDocument(),await m(e.getByText(`2 of 4 covered`)).toBeInTheDocument()}},x={render:e=>(0,p.jsx)(i,{items:{"Nobody yet":(0,p.jsx)(u,{...e,attendances:[],roster:s({positions:[],totalAttending:0})}),"A position nobody plays":(0,p.jsx)(u,{...e,attendances:[a(`u-nina`,`Nina Hendriks`,`Libero`,{state:`ABSENT`})],roster:s({positions:[v[3]],totalAttending:0})}),"Headcount only":(0,p.jsx)(u,{...e,roster:s({positions:[v[4]],totalAttending:11,totalTarget:12})}),"Untracked social":(0,p.jsx)(u,{...e,roster:s({...c,totalAttending:11})}),"Crowded position collapsed":(0,p.jsx)(u,{...e}),Pending:(0,p.jsx)(u,{...e,pending:!0})}}),play:async({canvas:e,userEvent:t})=>{let n=t=>g(e.getByRole(`region`,{name:t}));await m(n(`Nobody yet`).getByText(`Nobody has answered yet.`)).toBeInTheDocument(),await m(n(`A position nobody plays`).getByText(`nobody yet`)).toBeInTheDocument(),await m(n(`A position nobody plays`).getByRole(`button`,{name:/Nina Hendriks — Can't/})).toBeInTheDocument(),await m(n(`Headcount only`).getByText(`10/12 going`)).toBeInTheDocument(),await m(n(`Headcount only`).getByText(/1 staff also going/)).toBeInTheDocument(),await m(n(`Untracked social`).getByText(`11 going`)).toBeInTheDocument(),await m(n(`Untracked social`).queryByText(`covered`)).not.toBeInTheDocument(),await m(n(`Crowded position collapsed`).getByRole(`button`,{name:`Show 2 more going`})).toBeInTheDocument(),await m(n(`Crowded position collapsed`).queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument(),await t.click(n(`Pending`).getByRole(`button`,{name:/Lotte Dijkstra/})),await m(await g(document.body).findByRole(`button`,{name:`Going`})).toBeDisabled()}},S={parameters:{chromatic:{disableSnapshot:!0}},render:e=>(0,p.jsx)(i,{items:{Squad:(0,p.jsx)(u,{...e}),"Live count":(0,p.jsx)(d,{...e})}}),play:async({canvas:e,userEvent:t,args:n})=>{let r=t=>g(e.getByRole(`region`,{name:t})),i=g(document.body);await t.click(r(`Squad`).getByRole(`button`,{name:`Show 2 more going`})),await m(r(`Squad`).getByRole(`button`,{name:/Iris Kok — Going/})).toBeInTheDocument(),await t.click(r(`Squad`).getByRole(`button`,{name:`Show fewer going`})),await m(r(`Squad`).queryByRole(`button`,{name:/Iris Kok/})).not.toBeInTheDocument(),await t.click(r(`Squad`).getByRole(`button`,{name:/Lotte Dijkstra — Maybe/}));let a=await i.findByRole(`dialog`);await m(a).toHaveTextContent(`Lotte Dijkstra`),await m(a).toHaveTextContent(`Middle · currently maybe · you are answering for them`),await t.click(i.getByRole(`button`,{name:`Going`})),await m(n.onRespond).toHaveBeenCalledWith(`u-lotte`,`ATTENDING`),await t.click(r(`Squad`).getByRole(`button`,{name:/Eva Smit \(you\) — Going/}));let o=await i.findByRole(`dialog`);await m(o).toHaveTextContent(`Outside · currently going`),await m(o).not.toHaveTextContent(`answering for them`),await t.click(i.getByRole(`button`,{name:`Can't go`})),await m(n.onRespond).toHaveBeenCalledWith(`u-eva`,`ABSENT`),await m(r(`Live count`).getByText(`needs 1 more`)).toBeInTheDocument(),await m(r(`Live count`).getByText(`2 of 4 covered`)).toBeInTheDocument(),await t.click(r(`Live count`).getByRole(`button`,{name:/Lotte Dijkstra — Maybe/})),await t.click(i.getByRole(`button`,{name:`Going`})),await m(r(`Live count`).queryByText(`needs 1 more`)).not.toBeInTheDocument(),await m(r(`Live count`).getByText(`3 of 4 covered`)).toBeInTheDocument()}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Stack items={{
    'Nobody yet': <EventLineupPanel {...args} attendances={[]} roster={makeRoster({
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
    await userEvent.click(region('Pending').getByRole('button', {
      name: /Lotte Dijkstra/
    }));
    await expect(await within(document.body).findByRole('button', {
      name: 'Going'
    })).toBeDisabled();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C=[`Data`,`Shells`,`Interactions`]})))()}w();export{b as Data,S as Interactions,x as Shells,C as __namedExportsOrder,y as default};