import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./router-decorator-CrMJ4eCr.js";import{n as r}from"./event-fixtures-BaYeuP-I.js";import{n as i,t as a}from"./EventCard-yXra_SMy.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),i(),{expect:o}=__STORYBOOK_MODULE_TEST__,s=new Date(2026,7,10,9,0),c=(e,t=20,n=0)=>new Date(2026,7,e,t,n).toISOString(),l={title:`entities/event/EventCard`,component:a,decorators:[t],args:{now:s}},u={args:{event:r({startTime:c(13,14,30),location:`Sportcentrum Noord`})},play:async({canvas:e})=>{await o(e.getByText(`13`)).toBeInTheDocument(),await o(e.getByText(`14:30`)).toBeInTheDocument(),await o(e.getByText(`Match`)).toBeInTheDocument(),await o(e.getByText(/5 going/)).toBeInTheDocument(),await o(e.getByText(/of 8/)).toBeInTheDocument()}},d={args:{event:r({startTime:c(13)})},play:async({canvas:e})=>{await o(e.getByText(`in 3 days`)).toBeInTheDocument()}},f={args:{event:r({startTime:c(11)})},play:async({canvas:e})=>{await o(e.getByText(`Tomorrow`)).toBeInTheDocument()}},p={args:{event:r({startTime:c(31)})},play:async({canvas:e})=>{await o(e.getByText(`31`)).toBeInTheDocument(),await o(e.queryByText(/^in \d+ days$/)).not.toBeInTheDocument(),await o(e.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()}},m={args:{event:r({eventType:{id:`et-4`,name:`Social`,color:`#F4B400`},title:`Season kick-off drinks`,startTime:c(15,21,0),location:`Café De Hoek`,attendanceSummary:{attending:11,maybe:0,absent:2,notResponded:2,roleBreakdown:[]}})},play:async({canvas:e})=>{await o(e.getByText(`Social`)).toBeInTheDocument(),await o(e.getByText(`Season kick-off drinks`)).toBeInTheDocument(),await o(e.getByText(/11 going/)).toBeInTheDocument(),await o(e.getByText(`This weekend`)).toBeInTheDocument()}},h={args:{event:r({startTime:c(13),attendanceSummary:{attending:0,maybe:0,absent:0,notResponded:0,roleBreakdown:[]}})},play:async({canvas:e})=>{await o(e.getByText(/0 going/)).toBeInTheDocument(),await o(e.getByText(/of 0/)).toBeInTheDocument()}},g={args:{event:r({startTime:c(13),references:[{title:`Nevobo`,url:`https://api.nevobo.nl/permalink/wedstrijd/2018133`},{title:`Match form`,url:`https://dwf.volleybal.nl/match/42`},{title:`Route`,url:`https://maps.example.com/hall`}]})},play:async({canvas:e,canvasElement:t})=>{await o(e.getByRole(`link`,{name:/Nevobo/})).toBeInTheDocument(),await o(e.getByRole(`link`,{name:/Match form/})).toBeInTheDocument(),await o(e.getByText(`+1`)).toBeInTheDocument(),await o(t.querySelectorAll(`a a`)).toHaveLength(0)}},_={args:{event:r({startTime:c(13),location:`Sporthal De Boog`})},play:async({canvas:e,canvasElement:t})=>{let n=e.getByRole(`link`,{name:`Sporthal De Boog`});await o(n).toHaveAttribute(`href`,o.stringContaining(`maps.google.com`)),await o(n).toHaveAttribute(`target`,`_blank`),await o(t.querySelectorAll(`a a`)).toHaveLength(0)}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`Populated`,`WithQuietRelativeLabel`,`WithSolidRelativeLabel`,`WithoutRelativeLabel`,`SocialEvent`,`NoResponses`,`WithReferences`,`WithLocation`]})))()}y();export{h as NoResponses,u as Populated,m as SocialEvent,_ as WithLocation,d as WithQuietRelativeLabel,g as WithReferences,f as WithSolidRelativeLabel,p as WithoutRelativeLabel,v as __namedExportsOrder,l as default};