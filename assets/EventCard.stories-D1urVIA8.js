import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-JT0rtnVn.js";import{i as r,o as i,r as a}from"./event-fixtures-GLq-GGnS.js";import{n as o,t as s}from"./modes-Bzyminl_.js";import{n as c,t as l}from"./EventCard-CUxMfewW.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{n(),a(),o(),c(),{expect:u}=__STORYBOOK_MODULE_TEST__,d=new Date(2026,7,10,9,0),f=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),p={title:`entities/event/EventCard`,component:l,decorators:[t],args:{now:d},parameters:{chromatic:{modes:{light:s.light,dark:s.dark}}}},m={args:{event:r({startTime:f(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await u(e.getByText(`13`)).toBeInTheDocument(),await u(e.getByText(`14:30`)).toBeInTheDocument(),await u(e.getByText(`Match`)).toBeInTheDocument(),await u(e.getByText(/5 going/)).toBeInTheDocument(),await u(e.getByText(/of 8/)).toBeInTheDocument()}},h={args:{event:r({startTime:f(13)})},play:async({canvas:e})=>{await u(e.getByText(`in 3 days`)).toBeInTheDocument()}},g={args:{event:r({startTime:f(11)})},play:async({canvas:e})=>{await u(e.getByText(`Tomorrow`)).toBeInTheDocument()}},_={args:{event:r({startTime:f(31)})},play:async({canvas:e})=>{await u(e.getByText(`31`)).toBeInTheDocument(),await u(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await u(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},v={args:{event:r({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:f(15,21,0),location:`Café De Hoek`,attendanceSummary:{attending:11,maybe:0,absent:2,notResponded:2,roleBreakdown:[]}})},play:async({canvas:e})=>{await u(e.getByText(`Social`)).toBeInTheDocument(),await u(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await u(e.getByText(/11 going/)).toBeInTheDocument(),await u(e.getByText(`This weekend`)).toBeInTheDocument(),await u(e.queryByRole(`button`)).not.toBeInTheDocument()}},y={args:{event:r({startTime:f(13,14,30),location:`Sportcentrum Noord`,roster:i({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-libero`,label:`Libero`,required:1,attending:0},{id:`pos-middle`,label:`Middle`,required:2,attending:1}]})})},play:async({canvas:e,userEvent:t})=>{await u(e.getByText(`2 spots open`)).toBeInTheDocument(),await u(e.queryByText(/the one to chase/)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show positions/})),await u(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await u(e.getByText(/still has no one/)).toBeInTheDocument()}},b={args:{event:r({startTime:f(13),attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:12,roleBreakdown:[]}})},play:async({canvas:e})=>{await u(e.getByText(/0 going/)).toBeInTheDocument(),await u(e.getByText(/of 12/)).toBeInTheDocument(),await u(e.getByText(/12 pending/)).toBeInTheDocument()}},x={args:{event:r({startTime:f(13),attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await u(e.getByText(`No members yet`)).toBeInTheDocument(),await u(e.queryByText(/of 0/)).not.toBeInTheDocument(),await u(e.queryByText(/going/)).not.toBeInTheDocument()}},S={args:{event:r({startTime:f(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await u(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await u(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await u(e.getByText(`+1`)).toBeInTheDocument(),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},C={args:{event:r({startTime:f(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await u(n).toHaveAttribute(`href`,u.stringContaining(`maps.google.com`)),await u(n).toHaveAttribute(`target`,`_blank`),await u(t.querySelectorAll(`a a`)).toHaveLength(0)}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText(/5 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/of 8/)).toBeInTheDocument();
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
      attendanceSummary: {
        attending: 11,
        maybe: 0,
        absent: 2,
        notResponded: 2,
        roleBreakdown: []
      }
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument();
    await expect(canvas.getByText('Season kick-off drinks')).toBeInTheDocument();
    await expect(canvas.getByText(/11 going/)).toBeInTheDocument();
    // The 15th is the Saturday of the current week.
    await expect(canvas.getByText('This weekend')).toBeInTheDocument();
    // A social tracks no roster, so the card carries no status chip and no way to open a panel.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
    await userEvent.click(canvas.getByRole('button', {
      name: /Show positions/
    }));
    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument();
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      attendanceSummary: {
        attending: 0,
        maybe: 0,
        absent: 0,
        notResponded: 12,
        roleBreakdown: []
      }
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText(/0 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/of 12/)).toBeInTheDocument();
    await expect(canvas.getByText(/12 pending/)).toBeInTheDocument();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    event: makeEvent({
      startTime: on(13),
      attendanceSummary: {
        attending: 0,
        maybe: 0,
        absent: 0,
        notResponded: 0,
        roleBreakdown: []
      }
    })
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByText('No members yet')).toBeInTheDocument();
    // The broken-looking "of 0" denominator is not shown.
    await expect(canvas.queryByText(/of 0/)).not.toBeInTheDocument();
    await expect(canvas.queryByText(/going/)).not.toBeInTheDocument();
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
    // "<a> cannot contain a nested <a>" warning this fix removes). The card link and the maps
    // link are siblings; the card stays clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0);
  }
}`,...C.parameters?.docs?.source}}},w=[`Populated`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`WithRosterChip`,`NoResponses`,`NoMembersYet`,`WithReferences`,`WithLocation`]})))()}T();export{x as NoMembersYet,b as NoResponses,m as Populated,v as SocialEvent,C as WithLocation,h as WithQuietRelativeLabel,S as WithReferences,y as WithRosterChip,g as WithSolidRelativeLabel,_ as WithoutRelativeLabel,w as __namedExportsOrder,p as default};