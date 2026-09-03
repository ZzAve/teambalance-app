import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,o as n,r}from"./event-fixtures-GLq-GGnS.js";import{n as i,t as a}from"./router-decorator-Dxwte4QJ.js";import{n as o,t as s}from"./modes-Bzyminl_.js";import{n as c,t as l}from"./EventCard-C33iO_9s.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{a(),r(),o(),c(),{expect:u,fn:d}=__STORYBOOK_MODULE_TEST__,f=new Date(2026,7,10,9,0),p=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),m={title:`entities/event/EventCard`,component:l,decorators:[i],args:{now:f,myState:`NOT_RESPONDED`,onRespond:d()},parameters:{chromatic:{modes:{light:s.light,dark:s.dark}}}},h={args:{event:t({startTime:p(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await u(e.getByText(`13`)).toBeInTheDocument(),await u(e.getByText(`14:30`)).toBeInTheDocument(),await u(e.getByText(`Match`)).toBeInTheDocument(),await u(e.getByText(`Respond`)).toBeInTheDocument(),await u(e.queryByText(/of 8/)).not.toBeInTheDocument(),await u(e.queryByText(/pending/)).not.toBeInTheDocument()}},g={args:{event:t({startTime:p(13)}),myState:`ATTENDING`},play:async({canvas:e})=>{await u(e.getByText(`You're in`)).toBeInTheDocument()}},_={args:{event:t({startTime:p(13)})},play:async({canvas:e})=>{await u(e.getByText(`in 3 days`)).toBeInTheDocument()}},v={args:{event:t({startTime:p(11)})},play:async({canvas:e})=>{await u(e.getByText(`Tomorrow`)).toBeInTheDocument()}},y={args:{event:t({startTime:p(31)})},play:async({canvas:e})=>{await u(e.getByText(`31`)).toBeInTheDocument(),await u(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await u(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},b={args:{event:t({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:p(15,21,0),location:`Café De Hoek`,roster:{trackRoster:!1,totalTarget:void 0,totalAttending:11,positions:[],unassignedAttending:0,openSlots:0,state:`OFF`}})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`Social`)).toBeInTheDocument(),await u(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await u(e.getByText(`11 going`)).toBeInTheDocument(),await u(e.getByText(`This weekend`)).toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Change your answer/})),await u(e.getByRole(`button`,{name:`Going`})).toBeInTheDocument()}},x={args:{event:t({startTime:p(13,14,30),location:`Sportcentrum Noord`,roster:n({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-libero`,label:`Libero`,required:1,attending:0},{id:`pos-middle`,label:`Middle`,required:2,attending:1}]})})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`2 spots open`)).toBeInTheDocument(),await u(e.queryByText(/the one to chase/)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show lineup/})),await u(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await u(e.getByText(/still has no one/)).toBeInTheDocument()}},S={args:{event:t({startTime:p(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await u(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await u(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await u(e.getByText(`+1`)).toBeInTheDocument(),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},C={args:{event:t({startTime:p(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await u(n).toHaveAttribute(`href`,u.stringContaining(`maps.google.com`)),await u(n).toHaveAttribute(`target`,`_blank`),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord'
    })
  },
  play: async ({
    canvas
  }) => {
    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(canvas.getByText('13')).toBeInTheDocument();
    await expect(canvas.getByText('14:30')).toBeInTheDocument();
    // The type text label stays alongside the chit's colour.
    await expect(canvas.getByText('Match')).toBeInTheDocument();
    // The bottom row answers "what did I say?" — unanswered here, so it asks.
    await expect(canvas.getByText('Respond')).toBeInTheDocument();
    // The old "✓ 5 going · of 8 · 3 pending" counts are gone from the card.
    await expect(canvas.queryByText(/of 8/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/pending/)).not.toBeInTheDocument();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13)
    }),
    myState: 'ATTENDING'
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText("You're in")).toBeInTheDocument();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('in 3 days')).toBeInTheDocument();
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(11)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Tomorrow')).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(31)
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('31')).toBeInTheDocument();
    await expect(canvas.queryByText(/^in \\d+ days$/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      eventType: {
        id: 'et-4',
        name: 'Social',
        color: '#F4B400'
      },
      title: 'Season kick-off drinks',
      startTime: on(15, 21, 0),
      location: 'Café De Hoek',
      roster: {
        trackRoster: false,
        totalTarget: undefined,
        totalAttending: 11,
        positions: [],
        unassignedAttending: 0,
        openSlots: 0,
        state: 'OFF'
      }
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument();
    await expect(canvas.getByText('Season kick-off drinks')).toBeInTheDocument();
    // No roster verdict, so the headcount fallback carries the team information.
    await expect(canvas.getByText('11 going')).toBeInTheDocument();
    // The 15th is the Saturday of the current week.
    await expect(canvas.getByText('This weekend')).toBeInTheDocument();
    // Tapping the row opens the answer control even for a social.
    await userEvent.click(canvas.getByRole('button', {
      name: /Change your answer/
    }));
    await expect(canvas.getByRole('button', {
      name: 'Going'
    })).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord',
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [{
          id: 'pos-setter',
          label: 'Setter',
          required: 2,
          attending: 2
        }, {
          id: 'pos-libero',
          label: 'Libero',
          required: 1,
          attending: 0
        }, {
          id: 'pos-middle',
          label: 'Middle',
          required: 2,
          attending: 1
        }]
      })
    })
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument();
    // Collapsed on a list card until asked.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument();

    // The verdict is its own disclosure now — opening it reveals the pips, not the answer control.
    await userEvent.click(canvas.getByRole('button', {
      name: /Show lineup/
    }));
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      references: [{
        title: 'Nevobo',
        url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133'
      }, {
        title: 'Match form',
        url: 'https://dwf.volleybal.nl/match/42'
      }, {
        title: 'Route',
        url: 'https://maps.example.com/hall'
      }]
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // Two chips visible on the card, the third collapsed into "+1".
    await expect(canvas.getByRole('link', {
      name: /Nevobo/
    })).toBeInTheDocument();
    await expect(canvas.getByRole('link', {
      name: /Match form/
    })).toBeInTheDocument();
    await expect(canvas.getByText('+1')).toBeInTheDocument();
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      location: 'Sporthal De Boog'
    })
  },
  play: async ({
    canvas,
    canvasElement
  }) => {
    // The location renders as a real maps link that opens in a new tab...
    const maps = canvas.getByRole('link', {
      name: 'Sporthal De Boog'
    });
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'));
    await expect(maps).toHaveAttribute('target', '_blank');
    // ...and it must NOT be nested inside the card's own <Link> anchor (invalid HTML — the
    // "<a> cannot contain a nested <a>" warning). The card link and the maps link are siblings;
    // the card stays clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...C.parameters?.docs?.source}}},w=[`Populated`,`AnswerAttending`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`WithRosterVerdict`,`WithReferences`,`WithLocation`]})))()}T();export{g as AnswerAttending,h as Populated,b as SocialEvent,C as WithLocation,_ as WithQuietRelativeLabel,S as WithReferences,x as WithRosterVerdict,v as WithSolidRelativeLabel,y as WithoutRelativeLabel,w as __namedExportsOrder,m as default};