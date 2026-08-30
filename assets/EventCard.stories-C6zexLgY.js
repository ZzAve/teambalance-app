import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-BzT-wKZK.js";import{a as r,n as i,r as a}from"./event-fixtures-HgN_WguE.js";import{n as o,t as s}from"./EventCard-IUDwWhgQ.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),i(),o(),{expect:c}=__STORYBOOK_MODULE_TEST__,l=new Date(2026,7,10,9,0),u=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),d={title:`entities/event/EventCard`,component:s,decorators:[t],args:{now:l}},f={args:{event:a({startTime:u(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await c(e.getByText(`13`)).toBeInTheDocument(),await c(e.getByText(`14:30`)).toBeInTheDocument(),await c(e.getByText(`Match`)).toBeInTheDocument(),await c(e.getByText(/5 going/)).toBeInTheDocument(),await c(e.getByText(/of 8/)).toBeInTheDocument()}},p={args:{event:a({startTime:u(13)})},play:async({canvas:e})=>{await c(e.getByText(`in 3 days`)).toBeInTheDocument()}},m={args:{event:a({startTime:u(11)})},play:async({canvas:e})=>{await c(e.getByText(`Tomorrow`)).toBeInTheDocument()}},h={args:{event:a({startTime:u(31)})},play:async({canvas:e})=>{await c(e.getByText(`31`)).toBeInTheDocument(),await c(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await c(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},g={args:{event:a({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:u(15,21,0),location:`Café De Hoek`,attendanceSummary:{attending:11,maybe:0,absent:2,notResponded:2,roleBreakdown:[]}})},play:async({canvas:e})=>{await c(e.getByText(`Social`)).toBeInTheDocument(),await c(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await c(e.getByText(/11 going/)).toBeInTheDocument(),await c(e.getByText(`This weekend`)).toBeInTheDocument(),await c(e.queryByRole(`button`)).not.toBeInTheDocument()}},_={args:{event:a({startTime:u(13,14,30),location:`Sportcentrum Noord`,roster:r({state:`CRITICAL`,openSlots:2,totalAttending:5,positions:[{id:`pos-setter`,label:`Setter`,required:2,attending:2},{id:`pos-libero`,label:`Libero`,required:1,attending:0},{id:`pos-middle`,label:`Middle`,required:2,attending:1}]})})},play:async({canvas:e,userEvent:t})=>{await c(e.getByText(`2 spots open`)).toBeInTheDocument(),await c(e.queryByText(/the one to chase/)).not.toBeInTheDocument(),await t.click(e.getByRole(`button`,{name:/Show positions/})),await c(e.getByText(`1 of 3 covered`)).toBeInTheDocument(),await c(e.getByText(/still has no one/)).toBeInTheDocument()}},v={args:{event:a({startTime:u(13),attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await c(e.getByText(/0 going/)).toBeInTheDocument(),await c(e.getByText(/of 0/)).toBeInTheDocument()}},y={args:{event:a({startTime:u(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await c(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await c(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await c(e.getByText(`+1`)).toBeInTheDocument(),await c(t.querySelectorAll(`a a`)).toHaveLength(0)}},b={args:{event:a({startTime:u(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await c(n).toHaveAttribute(`href`,c.stringContaining(`maps.google.com`)),await c(n).toHaveAttribute(`target`,`_blank`),await c(t.querySelectorAll(`a a`)).toHaveLength(0)}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
    await expect(canvas.getByText(/0 going/)).toBeInTheDocument();
    await expect(canvas.getByText(/of 0/)).toBeInTheDocument();
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x=[`Populated`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`WithRosterChip`,`NoResponses`,`WithReferences`,`WithLocation`]})))()}S();export{v as NoResponses,f as Populated,g as SocialEvent,b as WithLocation,p as WithQuietRelativeLabel,y as WithReferences,_ as WithRosterChip,m as WithSolidRelativeLabel,h as WithoutRelativeLabel,x as __namedExportsOrder,d as default};