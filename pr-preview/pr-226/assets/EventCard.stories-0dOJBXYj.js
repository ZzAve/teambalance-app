import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-CJQuiZ-x.js";import{n as r,r as i}from"./event-fixtures-CRErpnsn.js";import{n as a,t as o}from"./EventCard-BHkm7LTB.js";var s,c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),r(),a(),{expect:s}=__STORYBOOK_MODULE_TEST__,c=new Date(2026,7,10,9,0),l=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),u={title:`entities/event/EventCard`,component:o,decorators:[t],args:{now:c}},d={args:{event:i({startTime:l(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await s(e.getByText(`13`)).toBeInTheDocument(),await s(e.getByText(`14:30`)).toBeInTheDocument(),await s(e.getByText(`Match`)).toBeInTheDocument(),await s(e.getByText(/5 going/)).toBeInTheDocument(),await s(e.getByText(/of 8/)).toBeInTheDocument()}},f={args:{event:i({startTime:l(13)})},play:async({canvas:e})=>{await s(e.getByText(`in 3 days`)).toBeInTheDocument()}},p={args:{event:i({startTime:l(11)})},play:async({canvas:e})=>{await s(e.getByText(`Tomorrow`)).toBeInTheDocument()}},m={args:{event:i({startTime:l(31)})},play:async({canvas:e})=>{await s(e.getByText(`31`)).toBeInTheDocument(),await s(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await s(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},h={args:{event:i({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:l(15,21,0),location:`Café De Hoek`,attendanceSummary:{attending:11,maybe:0,absent:2,notResponded:2,roleBreakdown:[]}})},play:async({canvas:e})=>{await s(e.getByText(`Social`)).toBeInTheDocument(),await s(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await s(e.getByText(/11 going/)).toBeInTheDocument(),await s(e.getByText(`This weekend`)).toBeInTheDocument()}},g={args:{event:i({startTime:l(13),attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await s(e.getByText(/0 going/)).toBeInTheDocument(),await s(e.getByText(/of 0/)).toBeInTheDocument()}},_={args:{event:i({startTime:l(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await s(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await s(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await s(e.getByText(`+1`)).toBeInTheDocument(),await s(t.querySelectorAll(`a a`)).toHaveLength(0)}},v={args:{event:i({startTime:l(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await s(n).toHaveAttribute(`href`,s.stringContaining(`maps.google.com`)),await s(n).toHaveAttribute(`target`,`_blank`),await s(t.querySelectorAll(`a a`)).toHaveLength(0)}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Populated`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`NoResponses`,`WithReferences`,`WithLocation`]})))()}b();export{g as NoResponses,d as Populated,h as SocialEvent,v as WithLocation,f as WithQuietRelativeLabel,_ as WithReferences,p as WithSolidRelativeLabel,m as WithoutRelativeLabel,y as __namedExportsOrder,u as default};